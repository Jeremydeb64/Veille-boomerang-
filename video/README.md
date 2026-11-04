# Vidéo « Récap veille » (Remotion)

Vidéo verticale 1080×1920 (~36 s) générée à partir de `../data/articles.json` :
intro avec la date, une scène par section (Valais, Romandie, Com' Suisse, Com' France,
International) avec 3 titres récents, puis une conclusion. Couleurs et police Boomerang.

```bash
npm i
npm run dev                                          # aperçu dans Remotion Studio
npx remotion render RecapVeille out/recap-veille.mp4  # export MP4
```

Les données sont lues au moment du rendu : relancer le rendu après la mise à jour de la veille
suffit pour obtenir la vidéo du jour.

- Durées des scènes : `TIMING` dans `src/RecapVeille.tsx`
- Choix des titres (nombre, longueur max, filtre) : `src/data.ts`
- Licence Remotion : gratuite jusqu'à 3 personnes, au-delà voir https://www.remotion.pro/license
