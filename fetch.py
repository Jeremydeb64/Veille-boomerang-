"""Lecteur RSS de la veille Boomerang.

Lit chaque flux de sources.yml, garde les articles des 36 dernières heures
(titre, lien, date, chapô court) et écrit :
  data/articles.json  — les articles, du plus récent au plus ancien
  data/status.json    — l'état de chaque flux (ok / erreur), pour repérer une source morte
Aucun texte complet n'est conservé : titre + chapô tronqué + lien vers l'original.
"""
import html
import json
import re
import sys
import urllib.request
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from xml.etree import ElementTree as ET

import yaml

ROOT = Path(__file__).parent
WINDOW_HOURS = 36
SUMMARY_MAX = 280
UA = "Mozilla/5.0 (compatible; BoomerangVeille/1.0; lecteur RSS interne)"
NS = {"atom": "http://www.w3.org/2005/Atom"}


def clean(text, limit=SUMMARY_MAX):
    text = html.unescape(re.sub(r"<[^>]+>", " ", text or ""))
    text = re.sub(r"\s+", " ", text).strip()
    return text[:limit].rsplit(" ", 1)[0] + "…" if len(text) > limit else text


def parse_date(raw):
    if not raw:
        return None
    raw = raw.strip()
    try:
        d = parsedate_to_datetime(raw)
    except (TypeError, ValueError):
        try:
            d = datetime.fromisoformat(raw.replace("Z", "+00:00"))
        except ValueError:
            return None
    return d if d.tzinfo else d.replace(tzinfo=timezone.utc)


def salvage(xml_bytes):
    """Répare un flux tronqué (ex. Abondance) en coupant après le dernier item complet."""
    text = xml_bytes.decode("utf-8", errors="replace")
    for close, tail in (("</item>", "</channel></rss>"), ("</entry>", "</feed>")):
        i = text.rfind(close)
        if i != -1:
            return (text[: i + len(close)] + tail).encode("utf-8")
    return xml_bytes


def parse_feed(xml_bytes, limit=SUMMARY_MAX):
    try:
        root = ET.fromstring(xml_bytes)
    except ET.ParseError:
        root = ET.fromstring(salvage(xml_bytes))
    items = []
    for it in root.iter("item"):  # RSS 2.0
        items.append({
            "title": clean(it.findtext("title")),
            "link": (it.findtext("link") or "").strip(),
            "date": parse_date(it.findtext("pubDate") or it.findtext("{http://purl.org/dc/elements/1.1/}date")),
            "summary": clean(it.findtext("description"), limit),
        })
    for it in root.iter("{http://www.w3.org/2005/Atom}entry"):  # Atom
        link = it.find("atom:link[@rel='alternate']", NS)
        if link is None:
            link = it.find("atom:link", NS)
        items.append({
            "title": clean(it.findtext("atom:title", namespaces=NS)),
            "link": link.get("href", "") if link is not None else "",
            "date": parse_date(it.findtext("atom:published", namespaces=NS) or it.findtext("atom:updated", namespaces=NS)),
            "summary": clean(it.findtext("atom:summary", namespaces=NS) or it.findtext("atom:content", namespaces=NS), limit),
        })
    return items


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read()


COMMON_PATHS = ["/feed/", "/rss", "/rss.xml", "/feed.xml", "/feeds/all.rss", "/rss/news", "/fr/rss", "/rss/all.xml", "/atom.xml"]


def looks_like_feed(raw):
    head = raw[:600].decode("utf-8", errors="ignore").lower()
    return "<rss" in head or "<feed" in head or "<rdf" in head


def discover(site):
    """Cherche le flux d'un site : balise <link rel=alternate> de la page d'accueil, puis chemins courants."""
    from urllib.parse import urljoin
    tried = []
    try:
        page = fetch(site).decode("utf-8", errors="ignore")
        for m in re.finditer(r"<link[^>]+>", page, re.I):
            tag = m.group(0)
            if re.search(r"application/(rss|atom)\+xml", tag, re.I):
                href = re.search(r'href=["\']([^"\']+)', tag, re.I)
                if href:
                    tried.append(urljoin(site, html.unescape(href.group(1))))
    except Exception:
        pass
    tried += [site.rstrip("/") + p for p in COMMON_PATHS]
    for url in tried:
        try:
            raw = fetch(url)
            if looks_like_feed(raw):
                return url, raw
        except Exception:
            continue
    return None, None


def main():
    sources = yaml.safe_load((ROOT / "sources.yml").read_text(encoding="utf-8"))
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(hours=WINDOW_HOURS)
    articles, status, seen = [], [], set()
    for s in sources:
        entry = {"name": s["name"], "section": s["section"], "url": s["url"]}
        try:
            try:
                raw = fetch(s["url"])
                if not looks_like_feed(raw):
                    raise ValueError("pas un flux")
            except Exception:
                if not s.get("site"):
                    raise
                found, raw = discover(s["site"])
                if not found:
                    raise ValueError("aucun flux trouvé sur " + s["site"])
                entry["discovered_url"] = found
            items = parse_feed(raw, s.get("summary_max", SUMMARY_MAX))
            kept = 0
            for a in items:
                if not a["title"] or not a["link"] or a["link"] in seen:
                    continue
                if a["date"] and a["date"] < cutoff:
                    continue
                seen.add(a["link"])
                articles.append({**a, "date": a["date"].isoformat() if a["date"] else None,
                                 "source": s["name"], "section": s["section"]})
                kept += 1
            entry.update(ok=True, items_in_feed=len(items), kept=kept)
        except Exception as e:  # une source en panne ne bloque pas les autres
            entry.update(ok=False, error=f"{type(e).__name__}: {e}"[:200])
        status.append(entry)
        print(("OK " if entry["ok"] else "KO ") + s["name"], entry.get("kept", entry.get("error")), file=sys.stderr)

    articles.sort(key=lambda a: a["date"] or "", reverse=True)
    out = ROOT / "data"
    out.mkdir(exist_ok=True)
    meta = {"generated_at": now.isoformat(), "window_hours": WINDOW_HOURS}
    (out / "articles.json").write_text(json.dumps({**meta, "articles": articles}, ensure_ascii=False, indent=1), encoding="utf-8")
    (out / "status.json").write_text(json.dumps({**meta, "sources": status}, ensure_ascii=False, indent=1), encoding="utf-8")


if __name__ == "__main__":
    main()
