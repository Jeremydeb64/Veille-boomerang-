/* Le Pouls — Accueil (extension Chrome « Nouvel onglet ») */
(function () {
  "use strict";
  var TZ = "Europe/Zurich";
  var RAW = "https://raw.githubusercontent.com/Jeremydeb64/Veille-boomerang-/main/";
  
  var VILLES = { Sierre: [46.2919, 7.5356], Lausanne: [46.5197, 6.6323] };
  var DEFAULTS = { name: "Jérémy", ics: "", villes: ["Sierre", "Lausanne"], wp: "jour" };

  /* ---------- stockage (chrome.storage, ou localStorage hors extension) ---------- */
  var hasChrome = typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync;
  function load(area, key) {
    return new Promise(function (res) {
      if (hasChrome) chrome.storage[area].get(key, function (o) { res(o[key]); });
      else { try { res(JSON.parse(localStorage.getItem(area + ":" + key))); } catch (e) { res(undefined); } }
    });
  }
  function store(area, key, val) {
    return new Promise(function (res) {
      var o = {}; o[key] = val;
      if (hasChrome) chrome.storage[area].set(o, res);
      else { try { localStorage.setItem(area + ":" + key, JSON.stringify(val)); } catch (e) {} res(); }
    });
  }
  /* cache local avec durée de vie, pour ne pas tout recharger à chaque onglet */
  function cached(key, maxAgeMin, getter) {
    return load("local", key).then(function (c) {
      if (c && Date.now() - c.at < maxAgeMin * 60000) return c.v;
      return getter().then(function (v) { store("local", key, { at: Date.now(), v: v }); return v; })
        .catch(function (e) { if (c) return c.v; throw e; });
    });
  }
  function getJSON(u) { return fetch(u, { cache: "no-store" }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }); }
  function getText(u) { return fetch(u, { cache: "no-store" }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); }); }

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (attrs[k] == null) continue;
      if (k === "text") n.textContent = attrs[k];
      else if (k === "cls") n.className = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }
  function $(id) { return document.getElementById(id); }

  var S = Object.assign({}, DEFAULTS);

  /* ---------- horloge ---------- */
  function tick() {
    var now = new Date();
    $("clock").textContent = now.toLocaleTimeString("fr-CH", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });
    $("today").textContent = now.toLocaleDateString("fr-CH", { timeZone: TZ, weekday: "long" }) + " " +
      now.toLocaleDateString("fr-CH", { timeZone: TZ, day: "numeric", month: "long", year: "numeric" });
    var h = +now.toLocaleTimeString("fr-CH", { timeZone: TZ, hour: "2-digit", hour12: false });
    $("hello").textContent = (h >= 5 && h < 12 ? "Bonjour" : h >= 12 && h < 18 ? "Bon après-midi" : "Bonsoir") + (S.name ? " " + S.name : "");
  }

  /* ---------- météo (Open-Meteo, en direct) ---------- */
  var CIEL = { 0: "Ensoleillé", 1: "Plutôt ensoleillé", 2: "Partiellement nuageux", 3: "Couvert", 45: "Brouillard", 48: "Brouillard givrant", 51: "Bruine", 53: "Bruine", 55: "Bruine", 61: "Pluie faible", 63: "Pluie", 65: "Forte pluie", 71: "Neige faible", 73: "Neige", 75: "Forte neige", 80: "Averses", 81: "Averses", 82: "Fortes averses", 85: "Averses de neige", 86: "Averses de neige", 95: "Orage", 96: "Orage et grêle", 99: "Orage et grêle" };
  function ico(c) { return c === 0 ? "☀" : c <= 2 ? "⛅" : c === 3 ? "☁" : c <= 48 ? "🌫" : c <= 67 || (c >= 80 && c <= 82) ? "🌧" : c <= 86 ? "❄" : "⛈"; }
  function meteo() {
    var box = $("meteo"); box.textContent = "";
    S.villes.forEach(function (v) {
      var p = VILLES[v]; if (!p) return;
      var url = "https://api.open-meteo.com/v1/forecast?latitude=" + p[0] + "&longitude=" + p[1] +
        "&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FZurich&forecast_days=1";
      var pill = el("span", { cls: "pill" }, [v]); box.appendChild(pill);
      cached("meteo-" + v, 30, function () { return getJSON(url); }).then(function (d) {
        var c = d.current.weather_code;
        pill.textContent = "";
        pill.title = (CIEL[c] || "") + " · min " + Math.round(d.daily.temperature_2m_min[0]) + "° / max " + Math.round(d.daily.temperature_2m_max[0]) + "°";
        pill.appendChild(el("span", { cls: "ic", "aria-hidden": "true", text: ico(c) }));
        pill.appendChild(document.createTextNode(v + " "));
        pill.appendChild(el("b", { text: Math.round(d.current.temperature_2m) + "°" }));
      }).catch(function () { pill.remove(); });
    });
  }

  /* ---------- fond d'écran ---------- */
  var layers = [$("wp-a"), $("wp-b")], cur = 0, photos = [], last = -1;
  function paint(src, author, link) {
    var img = new Image();
    img.onload = function () {
      var next = layers[1 - cur];
      next.style.backgroundImage = "url('" + src + "')";
      next.classList.add("on"); layers[cur].classList.remove("on"); cur = 1 - cur;
      var cr = $("credit"); cr.textContent = "Photo : " + author + " · ";
      cr.appendChild(el("a", { href: link, text: "Unsplash" }));
    };
    img.src = src;
  }
  function nextPhoto() {
    if (S.wp === "aucun") { layers.forEach(function (l) { l.classList.remove("on"); }); $("credit").textContent = ""; return; }
    if (!photos.length) return;
    var i; do { i = Math.floor(Math.random() * photos.length); } while (photos.length > 1 && i === last);
    last = i;
    var p = photos[i];
    paint(p.src, p.author, p.url);
  }
  function wallpapers() {
    $("wp-next").hidden = S.wp === "aucun";
    if (S.wp === "aucun") { nextPhoto(); return; }
    var job = S.wp === "libre"
      ? cached("picsum-list", 24 * 60, function () {
          return getJSON("https://picsum.photos/v2/list?page=" + (1 + Math.floor(Math.random() * 8)) + "&limit=100");
        }).then(function (l) {
          return l.filter(function (p) { return p.width >= 1900 && p.width > p.height; })
            .map(function (p) { return { src: "https://picsum.photos/id/" + p.id + "/1920/1200.jpg", author: p.author, url: p.url }; });
        })
      : cached("wp-jour", 60, function () { return getJSON(RAW + "wallpapers/credits.json"); }).then(function (j) {
          return (j.photos || []).map(function (p) { return { src: RAW + "wallpapers/" + p.file + "?d=" + j.date, author: p.author, url: p.url }; });
        });
    job.then(function (l) { photos = l; last = -1; nextPhoto(); }).catch(function () {});
  }

  /* ---------- derniers titres + clients (dépôt GitHub de la veille) ---------- */
  function veille() {
    Promise.all([
      cached("articles", 15, function () { return getJSON(RAW + "data/articles.json"); }),
      cached("clients", 24 * 60, function () { return getJSON(RAW + "clients.json"); }).catch(function () { return null; })
    ]).then(function (r) {
      var arts = (r[0].articles || []).slice().sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); });
      var une = $("une"); une.textContent = "";
      var pick = arts.filter(function (a) { return a.section === "valais" || a.section.indexOf("com-") === 0; }).slice(0, 5);
      if (pick.length < 5) pick = pick.concat(arts.filter(function (a) { return a.section === "romandie"; }).slice(0, 5 - pick.length));
      pick.forEach(function (a) {
        var t = a.date ? new Date(a.date).toLocaleTimeString("fr-CH", { timeZone: TZ, hour: "2-digit", minute: "2-digit" }) : "";
        une.appendChild(el("li", null, [el("div", null, [el("a", { href: a.link, text: a.title }), el("small", { text: a.source + (t ? " · " + t : "") })])]));
      });
      if (!une.children.length) une.appendChild(el("li", { cls: "empty", text: "Aucun titre pour l'instant." }));

      var cli = $("cli"); cli.textContent = "";
      cli.appendChild(el("h2", null, [el("span", { cls: "slash", "aria-hidden": "true" }), "Clients dans la presse"]));
      if (!r[1]) { cli.appendChild(el("span", { cls: "lbl", text: "Voir dans Le Pouls →" })); return; }
      var excl = (r[1].excluded_medias || []).map(function (x) { return x.toLowerCase(); });
      var noms = (r[1].clients || []).filter(function (n) { return n.length >= 5 && excl.indexOf(n.toLowerCase()) < 0; });
      var res = noms.map(function (n) { return { n: n, re: new RegExp("(^|[^\\p{L}])" + n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "($|[^\\p{L}])", "iu") }; });
      var hits = [], found = [];
      arts.forEach(function (a) {
        var txt = a.title + " " + (a.summary || "");
        var m = res.filter(function (x) { return x.re.test(txt); });
        if (m.length) { hits.push(a); m.forEach(function (x) { if (found.indexOf(x.n) < 0) found.push(x.n); }); }
      });
      cli.appendChild(el("span", { cls: "big", text: String(hits.length) }));
      cli.appendChild(el("span", { cls: "lbl", text: hits.length > 1 ? "mentions repérées" : hits.length ? "mention repérée" : "rien de neuf" }));
      if (found.length) cli.appendChild(el("span", { cls: "names", text: found.slice(0, 4).join(" · ") + (found.length > 4 ? " …" : "") }));
      cli.appendChild(el("span", { cls: "go", text: "Vérifier dans Le Pouls →" }));
    }).catch(function () {
      $("une").textContent = ""; $("une").appendChild(el("li", { cls: "empty", text: "Actualité indisponible pour le moment." }));
      $("cli").textContent = ""; $("cli").appendChild(el("span", { cls: "lbl", text: "Clients dans la presse : voir Le Pouls →" }));
    });
  }

  /* ---------- agenda Outlook (.ics) ---------- */
  function unfold(t) { return t.replace(/\r?\n[ \t]/g, ""); }
  function parseDate(v, params) {
    var m = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?$/.exec(v.trim());
    if (!m) return null;
    var allDay = !m[4] || /VALUE=DATE(;|$)/.test(params || "") && !m[4];
    if (m[7]) return { d: new Date(Date.UTC(+m[1], m[2] - 1, +m[3], +m[4], +m[5], +(m[6] || 0))), allDay: false };
    return { d: new Date(+m[1], m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0)), allDay: allDay };
  }
  function ymd(d) { return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); }
  function dayIndex(d) { return Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5); }
  var WD = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
  function occursOn(ev, day) {
    var s = ev.start.d;
    if (dayIndex(day) < dayIndex(s)) return false;
    if (ev.exdates.indexOf(ymd(day)) >= 0) return false;
    if (!ev.rrule) {
      var e = ev.end ? ev.end.d : s;
      var endIdx = ev.start.allDay ? dayIndex(e) - 1 : dayIndex(new Date(e.getTime() - 1));
      return dayIndex(day) >= dayIndex(s) && dayIndex(day) <= Math.max(endIdx, dayIndex(s));
    }
    var r = ev.rrule, iv = +(r.INTERVAL || 1);
    if (r.UNTIL) { var u = parseDate(r.UNTIL); if (u && dayIndex(day) > dayIndex(u.d)) return false; }
    var match = function (d) {
      var diff = dayIndex(d) - dayIndex(s);
      switch (r.FREQ) {
        case "DAILY": return diff % iv === 0;
        case "WEEKLY": {
          var days = r.BYDAY ? r.BYDAY.split(",") : [WD[s.getDay()]];
          if (days.indexOf(WD[d.getDay()]) < 0) return false;
          var mon = function (x) { return dayIndex(x) - ((x.getDay() + 6) % 7); };
          return Math.round((mon(d) - mon(s)) / 7) % iv === 0;
        }
        case "MONTHLY": {
          var months = (d.getFullYear() - s.getFullYear()) * 12 + d.getMonth() - s.getMonth();
          if (months % iv) return false;
          if (r.BYDAY) {
            var bm = /^(-?\d)?(\w\w)$/.exec(r.BYDAY.split(",")[0]); if (!bm) return false;
            if (WD[d.getDay()] !== bm[2]) return false;
            var n = +(bm[1] || r.BYSETPOS || 1);
            if (n > 0) return Math.ceil(d.getDate() / 7) === n;
            var dim = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
            return d.getDate() > dim - 7;
          }
          return d.getDate() === +(r.BYMONTHDAY || s.getDate());
        }
        case "YEARLY": return (d.getFullYear() - s.getFullYear()) % iv === 0 && d.getMonth() === s.getMonth() && d.getDate() === s.getDate();
      }
      return false;
    };
    if (!match(day)) return false;
    if (r.COUNT) { /* compte les occurrences jusqu'à ce jour (borné à 3 ans) */
      var n = 0, x = new Date(s.getFullYear(), s.getMonth(), s.getDate());
      for (var i = 0; i < 1100 && dayIndex(x) <= dayIndex(day); i++) {
        if (match(x) && ev.exdates.indexOf(ymd(x)) < 0) n++;
        x.setDate(x.getDate() + 1);
      }
      return n <= +r.COUNT;
    }
    return true;
  }
  function eventsToday(text) {
    var lines = unfold(text).split(/\r?\n/), evs = [], ev = null;
    lines.forEach(function (l) {
      if (l === "BEGIN:VEVENT") { ev = { exdates: [] }; return; }
      if (l === "END:VEVENT") { if (ev && ev.start) evs.push(ev); ev = null; return; }
      if (!ev) return;
      var i = l.indexOf(":"); if (i < 0) return;
      var head = l.slice(0, i), val = l.slice(i + 1), name = head.split(";")[0], params = head.slice(name.length);
      if (name === "DTSTART") ev.start = parseDate(val, params);
      else if (name === "DTEND") ev.end = parseDate(val, params);
      else if (name === "SUMMARY") ev.title = val.replace(/\\,/g, ",").replace(/\\;/g, ";").replace(/\\n/gi, " ");
      else if (name === "LOCATION") ev.loc = val.replace(/\\,/g, ",").replace(/\\;/g, ";");
      else if (name === "UID") ev.uid = val;
      else if (name === "STATUS") ev.status = val;
      else if (name === "RECURRENCE-ID") ev.recur = parseDate(val, params);
      else if (name === "EXDATE") val.split(",").forEach(function (v) { var p = parseDate(v, params); if (p) ev.exdates.push(ymd(p.d)); });
      else if (name === "RRULE") { ev.rrule = {}; val.split(";").forEach(function (kv) { var p = kv.split("="); ev.rrule[p[0]] = p[1]; }); }
    });
    var today = new Date(), key = ymd(today), out = [];
    var moved = {}; /* occurrences modifiées d'une série */
    evs.forEach(function (e) { if (e.recur) moved[e.uid + "|" + ymd(e.recur.d)] = true; });
    evs.forEach(function (e) {
      if (e.status === "CANCELLED") return;
      if (e.recur) { if (ymd(e.start.d) === key) out.push(e); return; }
      if (e.rrule && moved[e.uid + "|" + key]) return;
      if (occursOn(e, today)) out.push(e);
    });
    return out.map(function (e) {
      var st = e.start.d, at = new Date(today.getFullYear(), today.getMonth(), today.getDate(), st.getHours(), st.getMinutes());
      var dur = e.end ? e.end.d - e.start.d : 0;
      return { title: e.title || "(sans titre)", loc: e.loc || "", allDay: e.start.allDay, at: at, end: new Date(at.getTime() + dur) };
    }).sort(function (a, b) { return (a.allDay ? -1 : a.at) - (b.allDay ? -1 : b.at); });
  }
  function agenda() {
    var ul = $("agenda"); ul.textContent = "";
    if (!S.ics) {
      var b = el("button", { cls: "lnk", type: "button", text: "Ajouter mon agenda Outlook" });
      b.addEventListener("click", openSet);
      ul.appendChild(el("li", { cls: "empty" }, [b])); return;
    }
    ul.appendChild(el("li", { cls: "empty", text: "Chargement…" }));
    cached("ics:" + S.ics, 15, function () { return getText(S.ics.replace(/^webcal:/, "https:")); }).then(function (t) {
      var list = eventsToday(t), now = new Date(); ul.textContent = "";
      if (!list.length) { ul.appendChild(el("li", { cls: "empty", text: "Aucun rendez-vous aujourd'hui." })); return; }
      list.forEach(function (e) {
        var hm = e.allDay ? "Journée" : e.at.toLocaleTimeString("fr-CH", { hour: "2-digit", minute: "2-digit" });
        var cls = e.allDay ? "" : now > e.end ? "past" : now >= e.at ? "now" : "";
        ul.appendChild(el("li", { cls: cls }, [el("b", { text: hm }), el("span", null, [e.title, e.loc ? el("small", { text: e.loc }) : null])]));
      });
    }).catch(function () { ul.textContent = ""; ul.appendChild(el("li", { cls: "empty", text: "Agenda injoignable : vérifie le lien dans les réglages." })); });
  }

  /* ---------- réglages ---------- */
  function openSet() {
    $("s-name").value = S.name; $("s-ics").value = S.ics;
    $("s-sierre").checked = S.villes.indexOf("Sierre") >= 0; $("s-lausanne").checked = S.villes.indexOf("Lausanne") >= 0;
    document.querySelectorAll("input[name=wp]").forEach(function (r) { r.checked = r.value === S.wp; });
    $("save-st").textContent = ""; $("sheet").hidden = false; $("s-name").focus();
  }
  function closeSet() { $("sheet").hidden = true; $("open-set").focus(); }
  $("open-set").addEventListener("click", openSet);
  $("close-set").addEventListener("click", closeSet);
  $("sheet").addEventListener("click", function (e) { if (e.target === $("sheet")) closeSet(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !$("sheet").hidden) closeSet(); });
  $("save").addEventListener("click", function () {
    var w = document.querySelector("input[name=wp]:checked");
    var ics = $("s-ics").value.trim();
    if (ics && !/^(https|webcal):\/\//.test(ics)) { $("save-st").textContent = "Le lien doit commencer par https://"; return; }
    var oldWp = S.wp;
    S = { name: $("s-name").value.trim(), ics: ics,
      villes: ["Sierre", "Lausanne"].filter(function (v) { return $("s-" + v.toLowerCase()).checked; }), wp: w ? w.value : "jour" };
    store("sync", "reglages", S).then(function () {
      $("save-st").textContent = "Enregistré.";
      tick(); meteo(); agenda(); if (S.wp !== oldWp) wallpapers();
      setTimeout(closeSet, 600);
    });
  });
  $("wp-next").addEventListener("click", nextPhoto);

  load("sync", "reglages").then(function (saved) {
    if (saved) S = Object.assign({}, DEFAULTS, saved);
    tick(); setInterval(tick, 1000);
    meteo(); wallpapers(); veille(); agenda();
    setInterval(agenda, 5 * 60000);
  });
})();
