"""Petite boucle électro 124 BPM synthétisée (libre de droits) + whooshs aux transitions."""
import sys, wave
import numpy as np

SR = 44100
DUR = float(sys.argv[2])
WHOOSH_AT = [float(x) for x in sys.argv[3].split(",")]
BPM = 124
beat = 60 / BPM
N = int(SR * DUR)
mix = np.zeros(N)
rng = np.random.default_rng(7)


def add(sig, t, gain=1.0):
    i = int(t * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    mix[i : i + len(sig)] += sig * gain


def env(n, a=0.005, d=0.2):
    t = np.arange(n) / SR
    e = np.exp(-t / d)
    att = int(a * SR)
    if att:
        e[:att] *= np.linspace(0, 1, att)
    return e


def lowpass(x, alpha):
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc += alpha * (v - acc)
        y[i] = acc
    return y


def kick():
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = 50 + 110 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.001, 0.12)


def hat(open_=False):
    n = int((0.18 if open_ else 0.05) * SR)
    x = rng.standard_normal(n)
    x = x - lowpass(x, 0.25)
    return x * env(n, 0.001, 0.06 if open_ else 0.015)


def clap():
    n = int(0.2 * SR)
    x = rng.standard_normal(n)
    x = x - lowpass(x, 0.08)
    return x * env(n, 0.002, 0.05)


def note(freq, length, kind="pluck"):
    n = int(length * SR)
    t = np.arange(n) / SR
    if kind == "bass":
        s = np.sign(np.sin(2 * np.pi * freq * t)) * 0.6 + np.sin(2 * np.pi * freq * t)
        return lowpass(s, 0.04) * env(n, 0.004, 0.25)
    if kind == "pad":
        s = sum(np.sin(2 * np.pi * freq * d * t) for d in (0.997, 1.0, 1.003)) / 3
        a = np.minimum(1, t / 0.3) * np.minimum(1, (length - t) / 0.3)
        return s * a
    s = np.sin(2 * np.pi * freq * t) + 0.4 * np.sin(2 * np.pi * 2 * freq * t)
    return s * env(n, 0.002, 0.12)


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


# Progression Am - F - C - G (une mesure chacun)
chords = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]
roots = [45, 41, 48, 43]
bar = 4 * beat
nbars = int(np.ceil(DUR / bar))
for b in range(nbars):
    t0 = b * bar
    ch = chords[b % 4]
    for m in ch:
        add(note(hz(m), bar), t0, 0.06)
    drums = b >= 1  # la batterie entre à la 2e mesure
    for k in range(4):
        tb = t0 + k * beat
        if drums or k >= 2:
            add(kick(), tb, 0.9 if drums else 0.5)
        if drums:
            add(hat(), tb + beat / 2, 0.25)
            add(hat(), tb + beat / 4 * 3, 0.1)
            if k in (1, 3):
                add(clap(), tb, 0.35)
        add(note(hz(roots[b % 4]), beat * 0.45, "bass"), tb + beat / 2, 0.35)
    # arpège
    if b >= 1:
        arp = ch + [ch[0] + 12]
        for s in range(8):
            add(note(hz(arp[s % 4] + 12), beat / 2), t0 + s * beat / 2, 0.12)

# whooshs de transition
for w in WHOOSH_AT:
    n = int(0.45 * SR)
    x = rng.standard_normal(n)
    out = np.zeros(n)
    acc = 0.0
    for i in range(n):
        a = 0.02 + 0.35 * (i / n) ** 2
        acc += a * (x[i] - acc)
        out[i] = acc
    shape = np.sin(np.pi * np.arange(n) / n) ** 2
    add(out * shape, w - 0.35, 0.9)

# fondu de fin + normalisation
fade = int(0.8 * SR)
mix[-fade:] *= np.linspace(1, 0, fade)
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 0.9
stereo = np.stack([mix, mix], axis=1)
with wave.open(sys.argv[1], "wb") as f:
    f.setnchannels(2)
    f.setsampwidth(2)
    f.setframerate(SR)
    f.writeframes((stereo * 32767).astype("<i2").tobytes())
