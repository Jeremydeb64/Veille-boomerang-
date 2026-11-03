# Vortex polaire 2026 — documentaire en motion design (Remotion)

**« VORTEX POLAIRE : L’HIVER 2026 POURRAIT-IL BASCULER ? »**
88 s · 1920 × 1080 · 30 fps · français · MP4 H.264.

Tout est généré en code (React + SVG + d3-geo), de façon déterministe et piloté par les frames. Chaque élément reste modifiable.

## Démarrage

```bash
npm install
npm run dev            # Remotion Studio → composition « VortexPolaire2026 »
```

## Rendu

```bash
npx remotion render VortexPolaire2026 out/vortex-polaire-2026.mp4 --codec=h264 --crf=18
# avec la voix off enregistrée :
npx remotion render VortexPolaire2026 out/vortex-polaire-2026.mp4 --codec=h264 --crf=18 --props='{"subtitles":true,"voiceover":true,"music":true,"musicVolume":0.8}'
```

Captures de contrôle (une image par seconde indiquée) :

```bash
node scripts/stills.mjs 5 18 33 48 62 80     # → out/stills/
```

> Sur une machine sans Chrome Headless Shell téléchargeable, ajouter `--browser-executable=/chemin/vers/chrome-headless-shell` (ou `REMOTION_BROWSER=…` pour `stills.mjs`).

## Props de la composition

| Prop | Défaut | Rôle |
|---|---|---|
| `subtitles` | `true` | Sous-titres incrustés (repris de `timeline.json`) |
| `voiceover` | `true` | Lit `public/audio/voiceover.wav` (voix Alistair, Higgsfield) et abaisse la musique |
| `music` | `true` | Musique et sound design génératifs |
| `musicVolume` | `0.8` | Volume global musique + effets |

## Architecture

```
src/
  timeline.json            ← SOURCE UNIQUE : bornes des scènes + repères de voix off
  theme.ts                 palette, police Inter auto-hébergée, zones de sécurité
  Video.tsx                assemblage : séquences, fondus enchaînés, audio, sous-titres
  scenes/
    Scene01_Intro.tsx        0–11 s  globe, travelling vers l’Arctique, titre cinétique
    Scene02_Atmosphere.tsx  11–26 s  coupe verticale, caméra montante, bascule en vue du dessus
    Scene03_Disruption.tsx  26–41 s  ondes, déformation du vortex, trois états
    Scene04_Data.tsx        41–54 s  graphique qualitatif, tracés, compteur de dates, zoom
    Scene05_Europe.tsx      54–70 s  courbe → courant-jet, plongée sur l’Europe, scénarios A/B
    Scene06_Conclusion.tsx  70–88 s  retour au globe, textes finaux, « ? » dessiné, crédits
    shared.tsx               rotation globale du vortex, carte arctique, étiquettes
  components/
    AnimatedGlobe.tsx        globe orthographique Natural Earth, atmosphère, éclairage
    PolarVortex.tsx          vortex vu du dessus (déformation, division) + vortex projeté sur le globe
    FlowParticles.tsx        particules déterministes avec traînées
    AnimatedMap.tsx          carte vectorielle 1:50m zoomable, Suisse, étiquettes
    DataChart.tsx            graphique (schéma qualitatif documenté dans le fichier)
    KineticTitle.tsx         titres lettre à lettre / mot à mot, sur-titres
    SourceLabel.tsx          mentions de source, badges d’avertissement
    Subtitles.tsx, Backdrop.tsx
scripts/
  make_audio.py            musique + effets (numpy) → public/audio/*.mp3
  make-srt.mjs             SRT depuis timeline.json → voiceover/vortex-polaire.fr.srt
  stills.mjs               captures de contrôle
voiceover/
  SCRIPT.md                script minuté + indications de jeu
  vortex-polaire.fr.srt    sous-titres
SOURCES.md · ASSETS.md
```

## Modifier

- **Nouvelle voix off** : remplacer les prises dans `voiceover/takes.json` (ou déposer `voiceover/takes/<Scène>.wav`), puis `python3 scripts/build_voiceover.py && node scripts/make-srt.mjs`. Les sous-titres sont recalés sur les pauses de la voix.
- **Texte ou minutage de la voix off** : éditer `cues` dans `src/timeline.json`, puis `node scripts/make-srt.mjs`. Les sous-titres incrustés suivent automatiquement.
- **Durée d’une scène** : éditer `scenes` dans `timeline.json`. Les animations internes sont exprimées en frames depuis le début nominal de la scène (`o + n`, avec `o = OVERLAP`). Vérifier les captures ensuite.
- **Couleurs et police** : `src/theme.ts`.
- **Musique** : `python3 scripts/make_audio.py` régénère les pistes à partir de `timeline.json` (accords, impacts, montées alignés sur les scènes).
- **Forme du vortex** : `VortexShape` (`w1` déplacement, `w2` élongation, `split` division 0→1) dans `PolarVortex.tsx`.
- **Courant-jet des scénarios** : fonctions `jetA` et `jetB` en tête de `Scene05_Europe.tsx`.

## Rigueur scientifique

- Le graphique de la scène 4 est un **schéma qualitatif** : aucune valeur de vent fiable n’a pu être extraite des sources. Seul le seuil 0 m/s (inversion) est positionné. Les dates (3 nov., fenêtre 9–12 nov.) viennent des prévisions relayées. Voir `SOURCES.md`.
- La division en deux et les scénarios A/B sont présentés comme des **illustrations**, pas comme des prévisions.
- Avant diffusion, revérifier l’état des prévisions : elles changent d’un jour à l’autre.

## Licences

Code : celui du projet. Cartographie : Natural Earth (domaine public). Police : Inter (SIL OFL 1.1). Audio : création originale. Remotion : voir https://remotion.dev/license (gratuit jusqu’à 3 personnes).
