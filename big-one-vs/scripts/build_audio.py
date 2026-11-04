"""Construit la timeline et la bande-son complète de la vidéo.

Entrée  : src/voice.json (généré par build_voice.py)
Sorties : src/timeline.json   — découpage en scènes (frames) + repères de secousses
          public/audio/mix.m4a — voix + musique générative + effets, normalisé à -16 LUFS

La musique et les effets sont synthétisés ici (aucune banque de sons tierce) :
nappe douce Fmaj7 / Am7 / Cmaj7 / G6, basse, arpège léger, grondements sourds
aux moments des secousses, souffles discrets aux changements de scène.
"""
import json
import subprocess
from pathlib import Path

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

ROOT = Path(__file__).resolve().parent.parent
VOICE = json.loads((ROOT / "src" / "voice.json").read_text())
SR = 48000
FPS = 30
LEAD, TAIL = 0.25, 0.45  # secondes de respiration avant / après chaque prise

rng = np.random.default_rng(7)


def word_time(scene: dict, needle: str) -> float:
    for w in scene["words"]:
        if needle.lower() in w["w"].lower():
            return w["t"]
    raise KeyError(f"{needle} absent de {scene['id']}")


# ---------------------------------------------------------------- timeline
scenes, t = [], 0.0
for s in VOICE:
    dur = LEAD + s["duration"] + TAIL
    scenes.append({"id": s["id"], "start": t, "dur": dur, "voiceAt": t + LEAD})
    t += dur
TOTAL = t
by_id = {s["id"]: (s, v) for s, v in zip(scenes, VOICE)}

# Secousses : (scène, mot déclencheur, durée s, intensité 0-1)
SHAKES = [
    ("s01_hook", None, 2.2, 0.55),
    ("s03_1855", "tremble", 2.6, 0.9),
    ("s04_1946", "secouée", 2.4, 0.8),
    ("s09_pendant", "secousse", 1.6, 0.45),
]
shakes = []
for sid, word, dur, amp in SHAKES:
    sc, v = by_id[sid]
    at = sc["start"] + 0.05 if word is None else sc["voiceAt"] + word_time(v, word)
    shakes.append({"t": at, "dur": dur, "amp": amp})

timeline = {
    "fps": FPS,
    "durationInFrames": int(round(TOTAL * FPS)),
    "scenes": [
        {
            "id": s["id"],
            "from": int(round(s["start"] * FPS)),
            "durationInFrames": int(round((s["start"] + s["dur"]) * FPS)) - int(round(s["start"] * FPS)),
            "voiceFrom": int(round((s["voiceAt"] - s["start"]) * FPS)),
        }
        for s in scenes
    ],
    "shakes": [
        {"frame": int(round(x["t"] * FPS)), "durationInFrames": int(x["dur"] * FPS), "amp": x["amp"]}
        for x in shakes
    ],
}
(ROOT / "src" / "timeline.json").write_text(json.dumps(timeline, indent=1))
print(f"Durée totale : {TOTAL:.2f}s ({timeline['durationInFrames']} frames)")

N = int(np.ceil(TOTAL * SR)) + SR
tt = np.arange(N) / SR


def lp(x, f, order=2):
    return sosfilt(butter(order, f, "low", fs=SR, output="sos"), x)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


# ---------------------------------------------------------------- musique
BPM = 84
beat = 60 / BPM
bar = 4 * beat
chord_len = 2 * bar
CHORDS = [  # notes MIDI : basse, puis voix de la nappe
    (41, [57, 60, 64, 69]),  # Fmaj7
    (45, [57, 60, 64, 67]),  # Am7
    (36, [55, 60, 64, 71]),  # Cmaj7
    (43, [55, 59, 62, 64]),  # G6
]


def pad_voice(freq, n):
    tl = np.arange(n) / SR
    out = np.zeros(n)
    for det in (-0.06, 0.0, 0.07):  # léger désaccord pour une nappe chaude
        f = freq * 2 ** (det / 12)
        ph = rng.uniform(0, 2 * np.pi)
        for h, a in ((1, 1.0), (2, 0.35), (3, 0.12), (4, 0.05)):
            out += a * np.sin(2 * np.pi * f * h * tl + ph * h)
    return out / 3


pad = np.zeros(N)
bass = np.zeros(N)
arp = np.zeros(N)
fade = int(1.6 * SR)
k = 0
start = 0.0
while start < TOTAL + chord_len:
    root, notes = CHORDS[k % 4]
    i0 = int(start * SR)
    n = int((chord_len + 1.6) * SR)
    if i0 >= N:
        break
    n = min(n, N - i0)
    env = np.ones(n)
    a = min(fade, n)
    env[:a] = np.linspace(0, 1, a) ** 1.5
    env[-a:] *= np.linspace(1, 0, a) ** 1.5
    seg = sum(pad_voice(midi(m), n) for m in notes) / len(notes)
    pad[i0 : i0 + n] += seg * env
    bl = np.arange(n) / SR
    bass[i0 : i0 + n] += np.sin(2 * np.pi * midi(root) * bl) * env * 0.9
    # arpège : croches douces, motif montant
    pattern = [notes[0] + 12, notes[2] + 12, notes[1] + 12, notes[3] + 12]
    step = beat / 2
    for j in range(int(chord_len / step)):
        ts = start + j * step
        js = int(ts * SR)
        ln = int(0.9 * SR)
        if js + ln >= N:
            break
        nl = np.arange(ln) / SR
        f = midi(pattern[j % 4])
        tone = np.sin(2 * np.pi * f * nl) + 0.25 * np.sin(2 * np.pi * 2 * f * nl)
        arp[js : js + ln] += tone * np.exp(-nl * 5.5) * (0.9 if j % 2 == 0 else 0.6)
    start += chord_len
    k += 1

pad = lp(pad, 2400)
arp = lp(arp, 3800)

# L'arpège est discret pendant l'histoire, plus présent pendant « se préparer »
arp_gain = np.full(N, 0.35)
for sid in ("s08_avant", "s09_pendant", "s10_apres", "s11_outro"):
    sc, _ = by_id[sid]
    arp_gain[int(sc["start"] * SR) : int((sc["start"] + sc["dur"]) * SR)] = 0.75
arp_gain = lp(arp_gain, 0.5, order=1)

music = 0.55 * pad + 0.32 * bass + 0.16 * arp * arp_gain

# Réverbération simple (réponse impulsionnelle bruit exponentiel)
ir_len = int(2.4 * SR)
ir = rng.standard_normal(ir_len) * np.exp(-np.arange(ir_len) / SR * 2.6)
ir = lp(ir, 5000)
ir /= np.sqrt(np.sum(ir**2))
wet = fftconvolve(music, ir)[:N]
music = 0.75 * music + 0.35 * wet

# Fondu d'entrée / de sortie de la musique
env = np.ones(N)
env[: int(1.5 * SR)] = np.linspace(0, 1, int(1.5 * SR))
end = int(TOTAL * SR)
env[end - int(3 * SR) : end] = np.linspace(1, 0, int(3 * SR))
env[end:] = 0
music *= env

# ---------------------------------------------------------------- voix
voice = np.zeros(N)
for sc, v in zip(scenes, VOICE):
    raw = subprocess.check_output(
        ["ffmpeg", "-v", "error", "-i", str(ROOT / "public" / "voice" / f"{v['id']}.mp3"),
         "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"]
    )
    x = np.frombuffer(raw, dtype=np.float32).astype(np.float64)
    i0 = int(sc["voiceAt"] * SR)
    voice[i0 : i0 + len(x)] += x[: N - i0]

# Ducking : la musique baisse sous la voix
env_v = lp(np.abs(voice), 3, order=1)
env_v /= env_v.max() + 1e-9
duck = 1.0 - 0.55 * np.clip(env_v * 6, 0, 1)
duck = lp(duck, 1.5, order=1)
music *= duck

# ---------------------------------------------------------------- effets
sfx = np.zeros(N)
for x in shakes:
    i0 = int(x["t"] * SR)
    ln = int((x["dur"] + 1.5) * SR)
    ln = min(ln, N - i0)
    nl = np.arange(ln) / SR
    noise = np.cumsum(rng.standard_normal(ln))  # bruit brun
    noise -= lp(noise, 8)
    rumble = lp(noise, 90, order=4)
    rumble /= np.abs(rumble).max() + 1e-9
    sub = np.sin(2 * np.pi * (34 + 6 * np.sin(2 * np.pi * 0.7 * nl)) * nl)
    e = np.minimum(nl / 0.12, 1) * np.exp(-np.maximum(nl - 0.4, 0) * 1.9)
    crack = bp(rng.standard_normal(ln), 120, 900) * np.exp(-nl * 9) * 0.25
    sfx[i0 : i0 + ln] += (0.75 * rumble + 0.45 * sub + crack) * e * x["amp"]

for sc in scenes[1:]:  # souffle doux à chaque transition
    i0 = int((sc["start"] - 0.35) * SR)
    ln = int(0.8 * SR)
    nl = np.arange(ln) / SR
    w = bp(rng.standard_normal(ln), 300, 3500)
    e = np.sin(np.pi * nl / 0.8) ** 2
    sfx[i0 : i0 + ln] += w * e * 0.05

# ---------------------------------------------------------------- mix
mix_m = voice * 1.0 + music * 0.17 + sfx * 0.32
# léger élargissement stéréo de la musique (décalage de 9 ms à droite)
d = int(0.009 * SR)
music_r = np.concatenate([np.zeros(d), music[:-d]])
L = voice + music * 0.17 + sfx * 0.32
R = voice + music_r * 0.17 + sfx * 0.32
st = np.stack([L, R], axis=1)[: int(np.ceil(TOTAL * SR))]
st /= np.abs(st).max() * 1.12

out_dir = ROOT / "public" / "audio"
out_dir.mkdir(parents=True, exist_ok=True)
tmp = out_dir / "_mix.f32"
st.astype(np.float32).tofile(tmp)
subprocess.check_call(
    ["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", str(tmp),
     "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", str(SR), "-c:a", "aac", "-b:a", "192k",
     str(out_dir / "mix.m4a")]
)
tmp.unlink()
print("Bande-son : public/audio/mix.m4a")
