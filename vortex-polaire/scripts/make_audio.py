#!/usr/bin/env python3
"""
Musique et sound design génératifs, 100 % originaux (aucune ressource externe).
Lit src/timeline.json et écrit :
  public/audio/music.wav  — nappes électroniques atmosphériques, pulsations
  public/audio/sfx.wav    — vent, transitions aériennes, montées, bips de données

Usage : python3 scripts/make_audio.py
Dépendance : numpy uniquement. Rendu déterministe (graine fixe).
"""
import json
import os
import wave

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TL = json.load(open(os.path.join(ROOT, "src", "timeline.json"), encoding="utf-8"))
SR = 44100
DUR = TL["durationSec"]
N = int(SR * DUR)
t = np.arange(N) / SR
rng = np.random.default_rng(2026)
starts = {s["id"]: s["start"] for s in TL["scenes"]}


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def env_window(a, b, fade_in=2.0, fade_out=2.0):
    """Enveloppe 0→1→0 entre a et b (secondes), fondus en cosinus."""
    e = np.zeros(N)
    i = (t >= a - fade_in) & (t <= b + fade_out)
    x = t[i]
    up = np.clip((x - (a - fade_in)) / fade_in, 0, 1)
    dn = np.clip(((b + fade_out) - x) / fade_out, 0, 1)
    e[i] = (0.5 - 0.5 * np.cos(np.pi * up)) * (0.5 - 0.5 * np.cos(np.pi * dn))
    return e


def bandpass_noise(n, lo, hi, seed):
    g = np.random.default_rng(seed)
    x = g.standard_normal(n)
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(n, 1 / SR)
    shape = np.exp(-0.5 * ((np.log(f + 1) - np.log((lo * hi) ** 0.5)) / (np.log(hi / lo) / 2.2)) ** 2)
    y = np.fft.irfft(X * shape, n)
    return y / (np.abs(y).max() + 1e-9)


def lowpass(x, cutoff):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / (1 + (f / cutoff) ** 4)
    return np.fft.irfft(X, len(x))


# ------------------------------------------------------------------ musique
# Progression (ré mineur modal), une couleur harmonique par scène
CHORDS = [
    ("Scene01_Intro", [38, 50, 57, 62, 64]),  # Dm(add9)
    ("Scene02_Atmosphere", [34, 46, 53, 57, 62]),  # Bbmaj7
    ("Scene03_Disruption", [31, 43, 50, 55, 58, 63]),  # Gm(add b9) — tension
    ("Scene04_Data", [33, 45, 52, 57, 60, 64]),  # Am7(add11)
    ("Scene05_Europe", [34, 46, 53, 58, 62]),  # Bb
    ("Scene06_Conclusion", [38, 50, 57, 62, 65, 69]),  # Dm → ouverture
]
scene_end = {s["id"]: s["end"] for s in TL["scenes"]}

L = np.zeros(N)
R = np.zeros(N)
for sid, notes in CHORDS:
    e = env_window(starts[sid], scene_end[sid], 2.2, 2.2)
    for k, m in enumerate(notes):
        f0 = midi(m)
        lfo = 0.75 + 0.25 * np.sin(2 * np.pi * (0.07 + 0.013 * k) * t + k)
        amp = (0.22 if m < 45 else 0.11) * lfo
        for det, side in ((-0.18, 0), (0.18, 1)):
            ph = 2 * np.pi * f0 * (1 + det / 100) * t
            tone = np.sin(ph) + 0.28 * np.sin(2 * ph) + 0.08 * np.sin(3 * ph)
            if side == 0:
                L += amp * e * tone
            else:
                R += amp * e * tone

# Drone grave continu (ré)
drone = 0.16 * np.sin(2 * np.pi * midi(26) * t) * (0.8 + 0.2 * np.sin(2 * np.pi * 0.05 * t))
L += drone
R += drone

# Arpège de « données » (scène 4) : notes pincées douces
arp_notes = [69, 72, 76, 79, 76, 72]
s4, e4 = starts["Scene04_Data"], scene_end["Scene04_Data"]
step = 60 / 96 / 2
k = 0
x = s4 + 0.4
while x < e4 - 0.3:
    f0 = midi(arp_notes[k % len(arp_notes)])
    i0 = int(x * SR)
    n = int(1.2 * SR)
    tt = np.arange(min(n, N - i0)) / SR
    pluck = 0.05 * np.sin(2 * np.pi * f0 * tt) * np.exp(-tt * 5.5)
    (L if k % 2 == 0 else R)[i0 : i0 + len(tt)] += pluck
    (R if k % 2 == 0 else L)[i0 : i0 + len(tt)] += pluck * 0.5
    x += step
    k += 1

# Pulsations sourdes (scènes 3 et 4), tension croissante
pulse = np.zeros(N)
s3 = starts["Scene03_Disruption"]
beat = 60 / 64
x = s3 + 1.0
while x < e4 - 0.5:
    i0 = int(x * SR)
    tt = np.arange(int(0.7 * SR)) / SR
    tt = tt[: N - i0]
    f = 48 + 40 * np.exp(-tt * 18)
    ph = 2 * np.pi * np.cumsum(f) / SR
    gain = 0.12 + 0.18 * min(1, (x - s3) / 20)
    pulse[i0 : i0 + len(tt)] += gain * np.sin(ph) * np.exp(-tt * 6)
    x += beat
L += pulse
R += pulse

# Fondu général + normalisation
master = env_window(0.0, DUR - 3.0, 1.5, 3.0)
L = lowpass(L * master, 5200)
R = lowpass(R * master, 5200)
peak = max(np.abs(L).max(), np.abs(R).max())
L *= 0.32 / peak
R *= 0.32 / peak  # musique en retrait (≈ −10 dBFS crête) pour laisser la voix

# ------------------------------------------------------------------ sound design
SL = np.zeros(N)
SRr = np.zeros(N)

# Vent léger permanent, plus présent en scènes 1 et 6
wind = bandpass_noise(N, 180, 900, 1) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.11 * t) ** 2)
wind_gain = 0.05 + 0.06 * env_window(0, 11, 0.5, 2) + 0.05 * env_window(70, 86, 2, 2)
SL += wind * wind_gain
SRr += np.roll(wind, 1234) * wind_gain


def whoosh(at, dur=1.4, gain=0.22, seed=0):
    n = int(dur * SR)
    i0 = max(0, int((at - dur * 0.6) * SR))
    n = min(n, N - i0)
    tt = np.arange(n) / dur / SR
    lo = bandpass_noise(n, 200, 600, seed)
    hi = bandpass_noise(n, 1200, 4000, seed + 1)
    sweep = np.clip(tt * 1.6, 0, 1)
    sig = (lo * (1 - sweep) + hi * sweep) * np.sin(np.pi * tt) ** 2 * gain
    pan = tt
    SL[i0 : i0 + n] += sig * (1 - pan * 0.6)
    SRr[i0 : i0 + n] += sig * (0.4 + pan * 0.6)


def boom(at, gain=0.35):
    i0 = int(at * SR)
    tt = np.arange(int(2.5 * SR)) / SR
    tt = tt[: N - i0]
    f = 38 + 30 * np.exp(-tt * 8)
    ph = 2 * np.pi * np.cumsum(f) / SR
    sig = gain * np.sin(ph) * np.exp(-tt * 1.6)
    SL[i0 : i0 + len(tt)] += sig
    SRr[i0 : i0 + len(tt)] += sig


def riser(a, b, gain=0.12, seed=7):
    i0, i1 = int(a * SR), int(b * SR)
    n = i1 - i0
    tt = np.arange(n) / n
    noise = bandpass_noise(n, 600, 5000, seed)
    tone = np.sin(2 * np.pi * np.cumsum(220 + 660 * tt**2) / SR)
    sig = (noise * 0.7 + tone * 0.3) * tt**2 * gain
    SL[i0:i1] += sig
    SRr[i0:i1] += sig


def blip(at, f0=1600, gain=0.06):
    i0 = int(at * SR)
    tt = np.arange(int(0.09 * SR)) / SR
    sig = gain * np.sin(2 * np.pi * f0 * tt) * np.exp(-tt * 45)
    SL[i0 : i0 + len(tt)] += sig
    SRr[i0 : i0 + len(tt)] += sig * 0.7


boom(0.2, 0.3)  # ouverture
for i, s in enumerate(TL["scenes"][1:], start=1):
    whoosh(s["start"] + 0.1, seed=10 + i)
riser(starts["Scene03_Disruption"] + 2, starts["Scene03_Disruption"] + 9, 0.1)
boom(starts["Scene03_Disruption"] + 9.2, 0.25)
riser(starts["Scene04_Data"] + 9.5, starts["Scene04_Data"] + 11.6, 0.09, seed=9)
# bips de données au rythme des tracés de courbes (scène 4)
for j in range(10):
    blip(s4 + 1.7 + j * 0.32, 1500 + 90 * j)
for j in range(8):
    blip(s4 + 9.4 + j * 0.28, 900 + 60 * j, 0.07)
boom(starts["Scene06_Conclusion"] + 0.3, 0.28)
riser(starts["Scene06_Conclusion"] + 10.5, starts["Scene06_Conclusion"] + 13.2, 0.06, seed=11)

sfx_master = env_window(0.0, DUR - 2.5, 0.05, 2.5)
SL *= sfx_master
SRr *= sfx_master
speak = max(np.abs(SL).max(), np.abs(SRr).max())
SL *= 0.45 / speak
SRr *= 0.45 / speak


def write(path, l, r):
    data = np.stack([l, r], axis=1)
    data = np.clip(data, -1, 1)
    pcm = (data * 32767).astype("<i2").tobytes()
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm)
    print("écrit", path, f"{DUR}s")


out = os.path.join(ROOT, "public", "audio")
os.makedirs(out, exist_ok=True)
write(os.path.join(out, "music.wav"), L, R)
write(os.path.join(out, "sfx.wav"), SL, SRr)

# Encodage compact (MP3 320 kb/s) pour le dépôt et Remotion
import shutil
import subprocess

if shutil.which("ffmpeg"):
    for name in ("music", "sfx"):
        src = os.path.join(out, f"{name}.wav")
        dst = os.path.join(out, f"{name}.mp3")
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", src, "-b:a", "320k", dst], check=True)
        os.remove(src)
        print("encodé", dst)
