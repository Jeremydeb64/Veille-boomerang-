"""Fond d'écran et météo pour l'écran d'accueil du Pouls.

- wallpapers/ : 8 photos tirées au hasard dans la banque libre Picsum (photos Unsplash),
  renouvelées une fois par jour ; credits.json garde l'auteur de chaque photo.
- data/meteo.json : météo actuelle et du jour pour Sierre et Lausanne (Open-Meteo, sans clé).
"""
import json, random, urllib.request, datetime
from pathlib import Path

ROOT = Path(__file__).parent
UA = {"User-Agent": "veille-boomerang/1.0"}
N = 8

def get(url, timeout=30):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read(), dict(r.headers)

def wallpapers():
    out = ROOT / "wallpapers"; out.mkdir(exist_ok=True)
    today = datetime.date.today().isoformat()
    cred_f = out / "credits.json"
    if cred_f.exists() and json.loads(cred_f.read_text()).get("date") == today:
        print("fonds d'écran déjà renouvelés aujourd'hui"); return
    # liste des photos disponibles, puis tirage
    ids = []
    for page in range(1, 6):
        body, _ = get(f"https://picsum.photos/v2/list?page={page}&limit=100")
        ids += [p for p in json.loads(body) if p["width"] >= 1900 and p["width"] > p["height"]]
    picks = random.sample(ids, N)
    credits = []
    for i, p in enumerate(picks, 1):
        img, _ = get(f"https://picsum.photos/id/{p['id']}/1920/1200.jpg", 60)
        (out / f"wp-{i}.jpg").write_bytes(img)
        credits.append({"file": f"wp-{i}.jpg", "author": p["author"], "url": p["url"]})
    cred_f.write_text(json.dumps({"date": today, "source": "Picsum / Unsplash", "photos": credits}, ensure_ascii=False, indent=1))
    print(f"{N} fonds d'écran renouvelés")

CODES = {0:"Ensoleillé",1:"Plutôt ensoleillé",2:"Partiellement nuageux",3:"Couvert",45:"Brouillard",48:"Brouillard givrant",
 51:"Bruine",53:"Bruine",55:"Bruine",61:"Pluie faible",63:"Pluie",65:"Forte pluie",66:"Pluie verglaçante",67:"Pluie verglaçante",
 71:"Neige faible",73:"Neige",75:"Forte neige",77:"Grains de neige",80:"Averses",81:"Averses",82:"Fortes averses",
 85:"Averses de neige",86:"Averses de neige",95:"Orage",96:"Orage et grêle",99:"Orage et grêle"}

def meteo():
    villes = {"Sierre": (46.2919, 7.5356), "Lausanne": (46.5197, 6.6323)}
    res = {"updated": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="minutes"), "villes": []}
    for nom, (lat, lon) in villes.items():
        url = (f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}"
               "&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code"
               "&timezone=Europe%2FZurich&forecast_days=1")
        d = json.loads(get(url)[0])
        c, dl = d["current"], d["daily"]
        res["villes"].append({"ville": nom, "temp": round(c["temperature_2m"]), "code": c["weather_code"],
            "ciel": CODES.get(c["weather_code"], ""), "min": round(dl["temperature_2m_min"][0]), "max": round(dl["temperature_2m_max"][0])})
    (ROOT / "data").mkdir(exist_ok=True)
    (ROOT / "data" / "meteo.json").write_text(json.dumps(res, ensure_ascii=False, indent=1))
    print("météo :", res["villes"])

for job in (meteo, wallpapers):
    try: job()
    except Exception as e: print(job.__name__, "a échoué :", e)
