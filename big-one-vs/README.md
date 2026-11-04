# Big One · Valais — vidéo 9:16 (Remotion)

Vidéo explicative d'environ 3 minutes (1080×1920, 30 i/s) sur le « Big One », le séisme majeur attendu en Valais : historique, dégâts passés, projection actuelle et bons réflexes. Le ton se veut clair et rassurant, sans alarmisme.

## Déroulé

| # | Scène | Contenu |
|---|-------|---------|
| 1 | Accroche | Valais = région la plus sismique de Suisse · M6+ environ une fois par siècle |
| 2 | Frise | 1524 Ardon (~5,8) · 1755 Brigue (~6,1) · 1855 Viège (~6,2) · 1946 Sierre (~5,8) |
| 3 | 1855 | Viège, 25 juillet 1855 · plus fort séisme suisse depuis 300 ans · éboulements, répliques |
| 4 | 1946 | 25 janvier 1946, 18 h 32 · 4 morts · plus de 3 500 bâtiments · 26 mio CHF · éboulement du 30 mai |
| 5 | Pourquoi maintenant | 80 ans sans séisme majeur · imprévisible, mais dans la « fenêtre » statistique |
| 6 | Projection | Plaine du Rhône et effet de site · M6 près de Sion : 4,5 à 10 mrd CHF (scénario SED) |
| 7 | Effets en cascade | Chutes de pierres, glissements, avalanches, routes coupées |
| 8 | Avant | Fixer les meubles, provision de secours (9 L d'eau/pers.), point de rencontre, assurance |
| 9 | Pendant | Se baisser · s'abriter · s'agripper |
| 10 | Après | Répliques, sortir sans ascenseur, gaz, Alertswiss, 112 |
| 11 | Conclusion | « Pas une prophétie, une statistique » |

## Fabrication

```bash
npm install
pip install edge-tts numpy scipy

npm run voice    # voix off Microsoft Edge TTS (gratuite) → public/voice/*.mp3 + src/voice.json
npm run audio    # timeline + musique générative + effets + mixage -16 LUFS → public/audio/mix.m4a
npm run dev      # prévisualisation dans Remotion Studio
npm run render   # export → out/big-one-valais.mp4
```

- **Texte** : `scripts/script.json` (une entrée par scène). Après modification, relancer `voice` puis `audio` : toutes les animations et les sous-titres se recalent seuls sur le minutage des mots.
- **Voix** : `fr-FR-RemyMultilingualNeural` (débit -3 %). Autres voix possibles : `fr-CH-ArianeNeural`, `fr-CH-FabriceNeural` (accent suisse), `fr-FR-VivienneMultilingualNeural`. La voix s'appelle via `speech.platform.bing.com`, qui doit être autorisé sur le réseau.
- **Musique et effets** : synthétisés dans `scripts/build_audio.py`, sans banque de sons tierce ni droits.
- **Carte** : frontières Natural Earth (domaine public, paquet `world-atlas`). Le tracé du Rhône est approximatif.
- **Rendu dans un conteneur sans accès à remotion.media** : `REMOTION_BROWSER=/chemin/vers/chrome-headless-shell npm run render`.

## Sources

- Service sismologique suisse (SED, ETH Zurich) : fréquence M6 en Suisse (tous les 50 à 150 ans), scénario M6 près de Sion (4,5 à 10 mrd CHF).
- Canton du Valais, sites vs.ch/web/seismes et vs.ch/web/sdm/sismo : un séisme M6+ environ une fois par siècle en Valais.
- Archives de l'État du Valais et VKG, flyer « Séismes de 1946 en Valais » : 4 morts, plus de 3 500 bâtiments, plus de 26 mio CHF, environ 520 répliques, éboulement de 5 à 6 mio m³ au Six des Eaux Froides le 30 mai 1946.
- Fritsche et al. (2006, *Geophysical Journal International*) et (2012, *Swiss Journal of Geosciences*) : séisme de Viège 1855 (Mw 6,2 à 6,4 selon les sources), séismes historiques d'intensité VIII dans la vallée du Rhône.
- Gisler, Fäh et al., séismes de 1524 (Ardon) et 1755 (Brigue).
- Association Suisse d'Assurances (SVV), factsheet risque sismique : dommages sismiques en général non couverts.
- Consignes de comportement : Alertswiss / OFPP, notice d'urgence du Canton de Vaud. Provision de secours : OFAE.

Les magnitudes historiques sont des estimations, qui varient de ±0,3 selon les catalogues.
