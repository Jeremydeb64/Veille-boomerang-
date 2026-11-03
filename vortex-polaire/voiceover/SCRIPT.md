# Script voix off — « Vortex polaire : l’hiver 2026 pourrait-il basculer ? »

Durée totale : **88 s** · 30 fps · français · débit visé ≈ 135–145 mots/min.
Les repères ci-dessous sont **les mêmes que ceux de la vidéo** (`src/timeline.json`) : sous-titres, SRT et animations en dépendent.

## Indications de jeu

- Voix masculine française ou suisse romande neutre, 30–45 ans perçus, timbre légèrement grave.
- Ton documentaire scientifique : naturel, chaleureux, posé. Aucune emphase dramatique.
- Respecter les pauses marquées `/` (≈ 0,4 s) et `//` (≈ 0,8 s).
- « 2026 » se prononce « deux mille vingt-six ».
- Prise sèche, sans musique, WAV 48 kHz ou 44,1 kHz, 24 bits, crête ≈ −3 dBFS, sans traitement de réverbération.

---

### Scène 1 — Le hook · 0:00 → 0:11

| Début | Fin | Texte |
|---|---|---|
| 0:00.8 | 0:03.6 | À trente kilomètres au-dessus du pôle Nord, / |
| 0:03.6 | 0:06.0 | un phénomène inhabituel se prépare. // |
| 0:06.5 | 0:10.4 | Et il pourrait influencer la météo de notre hiver. |

### Scène 2 — Comprendre le phénomène · 0:11 → 0:26

| Début | Fin | Texte |
|---|---|---|
| 0:11.5 | 0:15.6 | Chaque hiver, de puissants vents tournent autour de l’Arctique. // |
| 0:16.0 | 0:18.6 | C’est le vortex polaire stratosphérique, / |
| 0:18.6 | 0:21.2 | une circulation atmosphérique qui se développe |
| 0:21.2 | 0:24.0 | à plusieurs dizaines de kilomètres d’altitude. |

### Scène 3 — La perturbation · 0:26 → 0:41

| Début | Fin | Texte |
|---|---|---|
| 0:26.5 | 0:29.6 | Mais début novembre 2026, les modèles annoncent |
| 0:29.6 | 0:32.2 | une perturbation particulièrement précoce. // |
| 0:32.8 | 0:35.0 | Les vents pourraient fortement ralentir, / |
| 0:35.0 | 0:37.0 | voire changer de direction. |

### Scène 4 — Les données · 0:41 → 0:54

| Début | Fin | Texte |
|---|---|---|
| 0:41.5 | 0:45.0 | Ce qui intrigue les scientifiques, c’est le calendrier. / |
| 0:45.4 | 0:49.3 | À cette période, le vortex devrait normalement se renforcer. / |
| 0:49.7 | 0:53.2 | Or les prévisions suggèrent un affaiblissement inhabituel. |

### Scène 5 — L’Europe et la Suisse · 0:54 → 1:10

| Début | Fin | Texte |
|---|---|---|
| 0:54.5 | 0:55.9 | Et pour l’Europe ? / |
| 0:56.3 | 0:59.0 | Une perturbation du vortex peut parfois modifier |
| 0:59.0 | 1:02.4 | la circulation atmosphérique, plusieurs semaines plus tard. // |
| 1:03.0 | 1:05.4 | Mais cela ne signifie pas automatiquement |
| 1:05.4 | 1:07.4 | une vague de froid en Suisse. |

### Scène 6 — Conclusion · 1:10 → 1:28

| Début | Fin | Texte |
|---|---|---|
| 1:10.5 | 1:13.3 | Le vortex polaire est donc à surveiller. / |
| 1:13.8 | 1:17.0 | Mais entre une perturbation à trente kilomètres d’altitude |
| 1:17.0 | 1:20.2 | et la météo dans nos villes, rien n’est automatique. // |
| 1:20.8 | 1:23.2 | L’hiver reste encore à écrire. |

1:23 → 1:28 : textes finaux, crédits, fondu au noir (musique seule).

---

## Texte continu (pour le comédien ou le TTS)

À trente kilomètres au-dessus du pôle Nord, un phénomène inhabituel se prépare. Et il pourrait influencer la météo de notre hiver.

Chaque hiver, de puissants vents tournent autour de l’Arctique. C’est le vortex polaire stratosphérique, une circulation atmosphérique qui se développe à plusieurs dizaines de kilomètres d’altitude.

Mais début novembre 2026, les modèles annoncent une perturbation particulièrement précoce. Les vents pourraient fortement ralentir, voire changer de direction.

Ce qui intrigue les scientifiques, c’est le calendrier. À cette période, le vortex devrait normalement se renforcer. Or les prévisions suggèrent un affaiblissement inhabituel.

Et pour l’Europe ? Une perturbation du vortex peut parfois modifier la circulation atmosphérique, plusieurs semaines plus tard. Mais cela ne signifie pas automatiquement une vague de froid en Suisse.

Le vortex polaire est donc à surveiller. Mais entre une perturbation à trente kilomètres d’altitude et la météo dans nos villes, rien n’est automatique. L’hiver reste encore à écrire.

*(150 mots, ≈ 66 s de parole effective, soit ≈ 137 mots/min.)*

## Intégrer l’enregistrement

1. Déposer le fichier dans `public/audio/voiceover.wav` (début du fichier = 0:00 de la vidéo).
2. Activer la prop `voiceover: true` (Studio → panneau des props, ou `--props='{"voiceover":true}'`). La musique s’abaisse automatiquement.
3. Si une phrase tombe à un autre moment, corriger ses `start`/`end` dans `src/timeline.json`, puis `node scripts/make-srt.mjs` : sous-titres incrustés et SRT suivent.
4. Une phrase doit toujours se terminer **avant** la fin de sa scène (voir `scenes` dans `timeline.json`).
