"""Génère la voix off (Microsoft Edge TTS, gratuit) scène par scène.

Sorties :
  public/voice/<id>.mp3          — une prise par scène
  src/voice.json                 — durée de chaque prise + minutage mot à mot (sous-titres)

Usage : python3 scripts/build_voice.py
Le proxy HTTPS de l'environnement est utilisé s'il est défini.
"""
import asyncio
import json
import os
import subprocess
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = json.loads((ROOT / "scripts" / "script.json").read_text())
OUT_DIR = ROOT / "public" / "voice"
OUT_DIR.mkdir(parents=True, exist_ok=True)
PROXY = os.environ.get("HTTPS_PROXY") or None


def duration(path: Path) -> float:
    out = subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)]
    )
    return float(out.strip())


async def synth(scene: dict) -> dict:
    path = OUT_DIR / f"{scene['id']}.mp3"
    com = edge_tts.Communicate(
        scene["text"],
        SCRIPT["voice"],
        rate=SCRIPT["rate"],
        pitch=SCRIPT["pitch"],
        boundary="WordBoundary",
        proxy=PROXY,
    )
    words = []
    with open(path, "wb") as f:
        async for chunk in com.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                words.append(
                    {
                        "t": round(chunk["offset"] / 1e7, 3),
                        "d": round(chunk["duration"] / 1e7, 3),
                        "w": chunk["text"],
                    }
                )
    return {"id": scene["id"], "text": scene["text"], "duration": round(duration(path), 3), "words": words}


async def main() -> None:
    results = []
    for scene in SCRIPT["scenes"]:
        r = await synth(scene)
        print(f"{r['id']:<16} {r['duration']:6.2f}s  {len(r['words'])} mots")
        results.append(r)
    (ROOT / "src" / "voice.json").write_text(json.dumps(results, ensure_ascii=False, indent=1))
    print(f"Total voix : {sum(r['duration'] for r in results):.1f}s")


asyncio.run(main())
