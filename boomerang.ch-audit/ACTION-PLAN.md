# Plan d'action SEO — www.boomerang.ch

Classement par priorité : Critique > Élevée > Moyenne > Faible. Effort : S = moins d'une demi-journée, M = 1 à 3 jours, L = plus d'une semaine.

## Phase 1 — Vérifications critiques (semaine 1)

| # | Action | Priorité | Effort | Comment vérifier |
|---|---|---|---|---|
| 1 | Vérifier que le pare-feu ou l'hébergeur ne bloque pas Googlebot, Bingbot ni les robots d'IA (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot). Le serveur coupe les connexions venant d'IP de centres de données. | Critique (à confirmer) | S | Search Console > Inspection d'URL > « Tester l'URL en ligne » ; Bing Webmaster > « Inspection d'URL » ; journaux serveur filtrés par user-agent. |
| 2 | Mesurer les Core Web Vitals et relever canonical, meta description et JSON-LD (non mesurables ici). | Élevée | S | pagespeed.web.dev (mobile) ; Screaming Frog en local pour title, description, canonical et schema. |

## Phase 2 — Gains rapides (semaines 1 et 2)

| # | Action | Priorité | Effort |
|---|---|---|---|
| 3 | Réécrire les `<title>` (50 à 60 caractères), avec un suffixe court « \| Boomerang ». Exemples :<br>• Accueil : « Agence de communication & web à Sierre et Lausanne \| Boomerang »<br>• Prestations : « Prestations : site internet, identité, campagnes \| Boomerang »<br>• Projet : « Barryland : site web et écrans interactifs \| Boomerang » | Élevée | S |
| 4 | H1 de l'accueil : remplacer « /boomerang marketing » par « Agence de communication et web en Valais et à Lausanne ». Le logotype reste en visuel. | Élevée | S |
| 5 | Redirection 301 de `/fr/blog/mesurer-le-succes-de-vos-campagnes-de-communication-2484/` vers `…-3354/`. | Moyenne | S |
| 6 | Afficher la date de publication, la date de mise à jour et l'auteur (lien vers la page équipe) sur chaque article. Ajouter le schema `BlogPosting`. | Élevée | S |
| 7 | Passer en `noindex` et retirer du sitemap : les deux pages « votre avis », `conditions-de-participation-2341`, `documentation-2388`. Corriger le slug « importantpour ». | Moyenne | S |
| 8 | Remplacer tous les `alt="Image"` par des descriptions (ex. « Chiots saint-bernard au musée Barryland, Martigny »). | Moyenne | S |
| 9 | Générer des `lastmod` exacts dans le sitemap et supprimer `priority`. | Faible | S |

## Phase 3 — Contenu et autorité (mois 2)

| # | Action | Priorité | Effort |
|---|---|---|---|
| 10 | **Créer une page par service** (800 à 1 200 mots chacune) : Création de site internet, Identité visuelle et logo, Communication globale, Campagnes, Rapports digitaux (rapatrier le contenu de rapportdigital.ch ou s'y lier clairement), Traduction, Hébergement et maintenance (fusionner avec `hebergement-professionnel-3697` et `support-clients-397`), et un service SEO / GEO, puisque le blog en parle. Chaque page contient : processus, livrables, 2 ou 3 projets liés, FAQ, CTA et schema `Service`. | Élevée | L |
| 11 | Enrichir les 14 études de cas avec ce schéma : contexte, objectif, ce que Boomerang a fait, **résultats chiffrés**, citation du client, liens vers les services concernés. Préciser clairement le rôle de chaque partenaire (ex. Forme pour Barryland). | Élevée | M |
| 12 | Transformer `/fr/contact/sierre-399/` et `/fr/contact/lausanne-400/` en pages locales : carte, horaires, accès, équipe sur place, projets de la région, schema `ProfessionalService`. Les lier depuis le menu ou le pied de page. | Élevée | M |
| 13 | Google Business Profile (Sierre et Lausanne) : revendiquer ou vérifier les fiches, renseigner les horaires, publier régulièrement, collecter des avis. Mettre à jour les horaires sur local.ch (affiché « Fermé »). | Élevée | S |
| 14 | Maillage interne : chaque article renvoie vers 1 ou 2 pages de services et un projet. Chaque projet renvoie vers les services utilisés. | Moyenne | M |
| 15 | Regrouper les articles qui se concurrencent : un article de référence « IA et recherche » (3404, 3447, 3342, 3807, 3825), un guide nLPD (2043, 2045, 2046). Mettre à jour ou rediriger les articles « tendances 2023/2024 ». | Moyenne | M |
| 16 | Données structurées `Organization` sur l'accueil : `sameAs`, `foundingDate` 2000, `founder`, logo, certifications ISO 9001 / 14001, Valais Excellence. | Moyenne | S |
| 17 | GEO : ajouter des blocs FAQ et des chiffres propres à l'agence (années d'activité, nombre de sites livrés, délais moyens, satisfaction du support), et ajouter des sources en lien dans les articles. | Moyenne | M |
| 18 | Harmoniser l'effectif annoncé (16 sur le site, 13 chez Infomaniak) et la description de l'agence sur les annuaires. | Faible | S |

## Phase 4 — Suivi (en continu)

- Search Console et Bing Webmaster Tools : suivre les impressions sur « agence web Sierre », « agence communication Valais », « création site internet Valais » et « agence web Lausanne ».
- Une fois `claude-seo` lancé depuis un poste qui atteint le site : `/seo drift baseline https://www.boomerang.ch`, puis une comparaison après chaque mise en production.
- Relancer cet audit (`/seo audit`) dans 3 mois.
