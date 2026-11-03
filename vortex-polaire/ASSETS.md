# Ressources utilisées

Tous les visuels sont **générés en code** (SVG piloté par les frames Remotion) : globe, vortex, particules, coupe atmosphérique, graphique, cartes, titres. Aucune image matricielle externe n’est utilisée.

| Ressource | Origine | Auteur / organisme | Licence | Utilisation |
|---|---|---|---|---|
| Traits de côte et terres 1:110m et 1:50m | https://www.naturalearthdata.com/ via le paquet npm `world-atlas` (https://github.com/topojson/world-atlas) | Natural Earth ; conversion TopoJSON par Mike Bostock | Domaine public (Natural Earth) ; paquet sous licence ISC | Globe (scènes 1 et 6), carte arctique (scènes 2–3) |
| Pays 1:50m (frontières, Suisse) | idem (`world-atlas/countries-50m.json`) | idem | idem | Carte de l’Europe et mise en évidence de la Suisse (scène 5) |
| Police Inter (300–800, italique 500) | https://rsms.me/inter/ via `@fontsource/inter`, copiée dans `public/fonts/` | Rasmus Andersson | SIL Open Font License 1.1 | Toute la typographie |
| Musique : `public/audio/music.mp3` | Générée par `scripts/make_audio.py` | Création originale pour ce projet | Libre de droits (œuvre propre) | Nappes, drone, arpège de données, pulsations |
| Sound design : `public/audio/sfx.mp3` | Générée par `scripts/make_audio.py` | Création originale pour ce projet | Libre de droits (œuvre propre) | Vent, transitions aériennes, montées, bips |
| Voix off : `public/audio/voiceover.wav` | **À fournir** (enregistrement) | — | — | Narration (voir `voiceover/SCRIPT.md`) |

## Ressources envisagées mais non intégrées

- **Textures terrestres NASA** (Blue Marble, Earth Observatory / SVS) : l’imagerie NASA est en général réutilisable avec mention, mais `svs.gsfc.nasa.gov` et `earthobservatory.nasa.gov` n’étaient pas joignables depuis l’environnement de production. Le globe est donc vectoriel : rendu net à toutes les échelles, et une teinte cohérente avec la palette.
  Pour ajouter une texture plus tard : la placer dans `public/assets/`, l’ajouter à ce tableau et l’appliquer dans `src/components/AnimatedGlobe.tsx` (motif SVG projeté ou React Three Fiber).
- **TTS** : aucun service gratuit et de qualité naturelle n’était disponible hors ligne (les modèles de voix ouverts sont hébergés sur des domaines bloqués). Aucun service payant n’a été utilisé, conformément au brief.
