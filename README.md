# Veille RSS Boomerang

Chaque matin (04:15 UTC), GitHub Actions lit les flux de `sources.yml` et écrit :

- `data/articles.json` : titre, lien, date et chapô court des articles des 36 dernières heures
- `data/status.json` : l'état de chaque flux (ok / erreur)

Claude lit ensuite ces fichiers, trie par thème, rédige les accroches et met à jour le dashboard.

- **Ajouter une source :** ajouter un bloc dans `sources.yml`.
- **Lancer à la main :** onglet Actions → « Veille RSS » → Run workflow.

Seuls le titre, un chapô tronqué et le lien sont conservés : jamais l'article complet.
