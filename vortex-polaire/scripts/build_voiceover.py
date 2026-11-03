#!/usr/bin/env python3
"""
Assemble la voix off à partir des prises par scène (voiceover/takes.json) :
  1. télécharge chaque prise (ou réutilise voiceover/takes/<scene>.wav) ;
  2. la place au début du premier sous-titre de sa scène ;
  3. détecte les silences pour recaler chaque sous-titre sur la parole réelle ;
  4. écrit public/audio/voiceover.wav (48 kHz mono) et met à jour src/timeline.json.
Ensuite : node scripts/make-srt.mjs, puis rendu avec voiceover=true.
"""
import json, os, re, subprocess, urllib.request, wave
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TL_PATH = os.path.join(ROOT, "src", "timeline.json")
TL = json.load(open(TL_PATH, encoding="utf-8"))
TAKES = json.load(open(os.path.join(ROOT, "voiceover", "takes.json"), encoding="utf-8"))["takes"]
SR = 48000
TDIR = os.path.join(ROOT, "voiceover", "takes")
os.makedirs(TDIR, exist_ok=True)


def load(path):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"],
                         check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype="<i2").astype(np.float32) / 32768


def speech_bounds(x):
    """Intervalles de parole (s) via énergie RMS 20 ms ; silences > 0,18 s."""
    hop = int(0.02 * SR)
    n = len(x) // hop
    rms = np.sqrt((x[: n * hop].reshape(n, hop) ** 2).mean(axis=1) + 1e-12)
    thr = max(10 ** (-42 / 20), rms.max() * 10 ** (-32 / 20))
    on = rms > thr
    segs, i = [], 0
    while i < n:
        if on[i]:
            j = i
            while j < n and (on[j] or (j + 9 < n and on[j:j + 9].any())):
                j += 1
            segs.append([i * 0.02, j * 0.02])
            i = j
        else:
            i += 1
    return segs


scenes = {s["id"]: s for s in TL["scenes"]}
total = np.zeros(int(TL["durationSec"] * SR), dtype=np.float32)
new_cues = []
for take in TAKES:
    sc = scenes[take["scene"]]
    local = os.path.join(TDIR, f"{take['scene']}.wav")
    if not os.path.exists(local):
        print("téléchargement", take["scene"])
        urllib.request.urlretrieve(take["url"], local)
    x = load(local)
    segs = speech_bounds(x)
    head, tail = segs[0][0], segs[-1][1]
    x = x[int(max(0, head - 0.03) * SR): int(min(len(x) / SR, tail + 0.25) * SR)]
    segs = [[a - head + 0.03, b - head + 0.03] for a, b in segs]
    cues = [c for c in TL["cues"] if sc["start"] <= c["start"] < sc["end"]]
    t0 = cues[0]["start"]
    if t0 + len(x) / SR > sc["end"] - 0.2:
        raise SystemExit(f"{take['scene']} : la prise ({len(x)/SR:.2f}s) dépasse la scène")
    i0 = int(t0 * SR)
    total[i0:i0 + len(x)] += x
    # Recalage : frontière de sous-titre = pause la plus proche de la position proportionnelle
    chars = [len(c["text"]) for c in cues]
    speech_len = segs[-1][1]
    gaps = [(segs[k][1] + segs[k + 1][0]) / 2 for k in range(len(segs) - 1)]
    bounds, acc = [0.0], 0
    for c in chars[:-1]:
        acc += c
        target = speech_len * acc / sum(chars)
        cand = [g for g in gaps if g > bounds[-1] + 0.6]
        g = min(cand, key=lambda v: abs(v - target)) if cand and min(abs(v - target) for v in cand) < 1.2 else target
        bounds.append(g)
    bounds.append(speech_len)
    for k, c in enumerate(cues):
        new_cues.append({"start": round(t0 + bounds[k], 2), "end": round(t0 + bounds[k + 1], 2), "text": c["text"]})
    print(f"{take['scene']}: {len(x)/SR:.2f}s, {len(segs)} segments de parole")

peak = np.abs(total).max()
total *= 0.7 / peak  # ≈ −3 dBFS crête
out = os.path.join(ROOT, "public", "audio", "voiceover.wav")
with wave.open(out, "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(total, -1, 1) * 32767).astype("<i2").tobytes())
TL["cues"] = new_cues
json.dump(TL, open(TL_PATH, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
open(TL_PATH, "a").write("\n")
print("écrit", out, "et timeline.json recalé")
