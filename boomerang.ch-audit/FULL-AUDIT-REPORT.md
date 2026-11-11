# Audit SEO complet — www.boomerang.ch

**Date :** 11 novembre 2026
**Outil :** claude-seo v2.6.0 (skill `seo-audit`), exécuté depuis une session cloud Claude Code
**Périmètre :** 67 URL du sitemap (18 pages, 35 articles de blog, 14 projets), dont 12 analysées en détail
**Type d'activité détecté :** agence de communication et web (B2B, services, implantation locale à Sierre et Lausanne)

---

## Limites de cet audit (à lire en premier)

Le serveur de boomerang.ch coupe les connexions directes venant de l'environnement d'audit (TCP reset après le TLS ClientHello, sur `boomerang.ch` comme sur `www.boomerang.ch`). Le rendu Playwright, la lecture des en-têtes HTTP et le HTML brut n'ont donc pas pu être utilisés. L'API PageSpeed Insights a aussi refusé la requête (quota journalier partagé épuisé).

Les pages ont été lues via un outil de récupération web qui renvoie le contenu converti en texte. Conséquences :

| Vérifié | Non vérifié (à contrôler avec un crawl local ou la Search Console) |
|---|---|
| robots.txt, sitemap XML, titres de page, H1–H3, textes, liens internes, alt des images visibles, coordonnées, présence dans la recherche | balise `<meta name="description">`, `<link rel="canonical">`, JSON-LD / Schema.org, en-têtes de sécurité (HSTS, CSP…), codes de redirection, Core Web Vitals (LCP, INP, CLS), poids des images |

Le blocage des connexions est peut-être un pare-feu anti-bots côté hébergeur. **À vérifier : s'assurer que ce pare-feu ne bloque pas aussi Googlebot, Bingbot ou les robots des IA** (GPTBot, ClaudeBot, PerplexityBot). Un test « Inspection d'URL » dans la Search Console suffit pour Google.

---

## Résumé

### Score de santé SEO : **57 / 100** (provisoire)

Le score ne compte que les catégories vérifiables. Schema (10 %) et Performance (10 %) sont exclus et les poids restants sont recalculés sur 80 %.

| Catégorie | Poids | Score | Statut |
|---|---|---|---|
| SEO technique | 22 % | 70 | Partiel |
| Qualité du contenu | 23 % | 55 | Vérifié |
| SEO on-page | 20 % | 50 | Vérifié |
| Schema / données structurées | 10 % | — | Non vérifié |
| Performance (CWV) | 10 % | — | Non vérifié |
| Préparation recherche IA (GEO) | 10 % | 55 | Partiel |
| Images | 5 % | 35 | Vérifié |

### Les 5 problèmes principaux

1. **Aucune page dédiée par service.** Les 7 prestations (site internet, identité de marque, communication globale, campagnes, rapports digitaux, support, traduction) tiennent sur une seule page d'environ 420 mots. Rien ne peut se positionner sur « création site internet Valais » ou « agence identité visuelle Sierre ».
2. **Boomerang n'apparaît pas sur les requêtes locales clés.** Sur « agence web Sierre Valais » et « agence de communication Valais création site internet », les résultats sont des annuaires (Infomaniak, Clutch, local.ch). Boomerang n'y figure que via sa fiche partenaire Infomaniak.
3. **Les titres de page sont trop longs et identiques.** Chaque page reprend le suffixe « Boomerang Marketing : Agence web, graphisme, marketing et création internet - Sierre en Valais et Lausanne, Vaud » (112 caractères pour l'accueil, 124 pour une page projet). Google tronque vers 60 caractères : la partie utile est coupée et toutes les pages se ressemblent.
4. **Le blog n'affiche ni date ni auteur, et contient un doublon.** L'article « Mesurer le succès de vos campagnes de communication » existe deux fois (ID 2484 et 3354). Aucun article ne renvoie vers une page de prestation.
5. **H1 de l'accueil non descriptif.** Le H1 est « /boomerang marketing ». Il ne dit ni ce que fait l'agence ni où elle est.

### 5 gains rapides

1. Réécrire les balises `<title>` : 50 à 60 caractères, une formule propre à chaque page (exemples dans le plan d'action).
2. Rediriger en 301 l'article doublon `…-2484/` vers `…-3354/`.
3. Afficher la date de publication et l'auteur (avec lien vers la page équipe) sur chaque article.
4. Remplacer les `alt="Image"` des pages projets par des descriptions réelles.
5. Retirer du sitemap les pages sans valeur de recherche (formulaires d'avis, conditions de participation, documentation) et les passer en `noindex`.

---

## 1. SEO technique — 70/100 (partiel)

**Ce qui fonctionne**
- HTTPS partout, aucune URL en http dans le sitemap.
- robots.txt propre : seul `/wp/wp-admin/` est bloqué, `admin-ajax.php` reste autorisé, le sitemap est déclaré.
- Sitemap XML valide (`/fr/sitemap.xml`, 67 URL) qui couvre pages, blog et projets.
- URL lisibles en français.

**Constats**

| Gravité | Constat | Preuve |
|---|---|---|
| Élevée | Connexions directes refusées par le serveur | Reset TCP sur `boomerang.ch:443` et `www.boomerang.ch:443` depuis l'environnement d'audit, alors que d'autres sites répondent. Si le pare-feu filtre par IP de centre de données, il peut bloquer des robots d'exploration légitimes. |
| Moyenne | `lastmod` du sitemap peu fiable | 34 des 35 articles portent la même date (2025-07-04), ce qui ressemble à une mise à jour en masse. Google ignore les `lastmod` qu'il juge non fiables. |
| Moyenne | Pages sans valeur de recherche dans le sitemap | `/fr/contact/votre-avis-nous-interesse-vraiment-3579/`, `/fr/contact/votre-avis-est-importantpour-l-equipe-du-support-3626/` (faute « importantpour » dans le slug), `/fr/conditions-de-participation-2341/`, `/fr/documentation-2388/`, `/fr/menu-pied-de-page/declaration-de-consentement-aux-cookies-4/`. |
| Faible | `priority` = 1 pour toutes les URL | Aucune hiérarchie. Google ignore ce champ : on peut le supprimer. |
| Faible | `/sitemap.xml` à la racine renvoie 404 | Le sitemap réel est `/fr/sitemap.xml`, déclaré dans robots.txt, donc pas bloquant. Une redirection 301 de la racine aide les outils qui ne lisent pas robots.txt. |
| Faible | Identifiants numériques dans les URL (`-146`, `-392`…) | Pratique du CMS. À ne pas changer sans plan de redirections : le gain ne justifie pas le risque. |
| À vérifier | Canonical, en-têtes de sécurité, codes de redirection http→https et apex→www | Non mesurables depuis cet environnement. |

## 2. Qualité du contenu (E-E-A-T) — 55/100

**Ce qui fonctionne**
- La page « L'agence » est un vrai atout E-E-A-T : historique (Conchita fondée en 2000, fusion avec Boomerang Marketing SA en 2010), équipe nommée de 16 personnes avec leurs rôles, certifications ISO 9001 et ISO 14001, label Valais Excellence, « Entreprise citoyenne ».
- 14 études de cas avec texte, plus une liste de clients reconnus (HES-SO, Ville de Martigny, Canal 9, Valais Wallis Promotion…).
- Articles récents bien structurés sur des sujets porteurs (GEO, IA, SEO). Par exemple « Comment rendre votre entreprise visible sur les IA ? » : environ 1 400 mots et un plan H2/H3 clair.

**Constats**

| Gravité | Constat | Preuve |
|---|---|---|
| Élevée | Pages de prestations trop minces | `/fr/prestations-392/` : environ 420 mots pour 7 services. Une seule sous-page existe (`support-clients-397`). |
| Élevée | Études de cas sans résultats | Barryland : environ 180 mots, sections « point de départ » et « point d'arrivée », mais aucun chiffre ni témoignage client. Le design est attribué à l'agence Forme, ce qui affaiblit la démonstration d'expertise. |
| Élevée | Blog sans date ni auteur | Aucune date et aucun auteur sur la page liste comme sur les articles. Google et les IA perdent les signaux de fraîcheur et d'expertise. |
| Moyenne | Article en double | « Mesurer le succès de vos campagnes de communication » : `…-2484/` et `…-3354/`. |
| Moyenne | Sujets qui se concurrencent | IA et recherche : 3404, 3447, 3342, 3807, 3825. nLPD : 2043, 2045, 2046. Tendances datées : « 2023 », « Digital : les tendances 2024 », « SEO 2025 ». |
| Moyenne | Contenu générique, sans preuve terrain | L'article IA ne s'appuie que sur un exemple hypothétique (« Imaginons… une entreprise de rénovation en Valais »), sans cas client réel, chiffre ou source en lien. |
| Faible | Incohérence d'effectif | 16 personnes sur le site contre 13 collaborateurs sur la fiche partenaire Infomaniak. |

## 3. SEO on-page — 50/100

| Gravité | Constat | Preuve / recommandation |
|---|---|---|
| Élevée | `<title>` trop longs, suffixe identique | Accueil : 112 caractères. Pages projets : 124. La partie distinctive est noyée. |
| Élevée | Pas de pages cibles pour les requêtes commerciales | Il manque « création de site internet Valais / Sierre / Lausanne », « identité visuelle / logo Valais », « agence de communication Sierre », « rapport annuel digital » (ce dernier est renvoyé vers un site externe, rapportdigital.ch), « traduction », « hébergement web Valais ». |
| Élevée | H1 de l'accueil | « /boomerang marketing ». Proposition : « Agence de communication et web à Sierre et Lausanne ». |
| Moyenne | Maillage interne pauvre | Les articles n'ont aucun lien dans le texte vers les prestations. La page prestations ne contient que 4 liens internes (dont 3 vers Contact). Les projets ne renvoient pas aux services concernés. |
| Moyenne | Pages isolées | `/fr/hebergement-professionnel-3697/` (environ 115 mots) n'est pas dans le menu et ne semble pas liée depuis Prestations. |
| Moyenne | Pages locales faibles | `/fr/contact/sierre-399/` et `/fr/contact/lausanne-400/` ne figurent pas dans le menu et n'ont ni carte, ni horaires des bureaux, ni contenu local. |
| Faible | Hiérarchie de titres | Plusieurs pages sautent de H1 à H3 (Prestations, L'agence, Contact, projets). |

## 4. Schema / données structurées — non vérifié

Le JSON-LD n'est pas visible avec l'outil utilisé. Points à contrôler, puis à mettre en place s'ils manquent :
- `Organization` sur l'accueil avec `logo`, `sameAs` (LinkedIn, Facebook, Instagram), `founder`, `foundingDate` (2000) et les certifications (`hasCredential` ISO 9001 / 14001).
- `ProfessionalService` (ou `LocalBusiness`) pour chaque bureau : adresse, téléphone, `geo`, `openingHoursSpecification`, `areaServed`.
- `Service` sur chaque future page de prestation.
- `BlogPosting` avec `datePublished`, `dateModified` et `author` (`Person`) sur les articles.
- `BreadcrumbList` sur l'ensemble du site.

## 5. Performance (Core Web Vitals) — non vérifié

PageSpeed Insights a refusé la requête (quota épuisé) et Lighthouse local n'a pas pu joindre le site. À mesurer depuis le réseau de l'agence : pagespeed.web.dev, ou le rapport « Signaux Web essentiels » de la Search Console pour les données terrain. Points de vigilance probables : page d'accueil chargée en logos clients, galeries de 13 images ou plus sur les pages projets, bandeau de cookies.

## 6. Images — 35/100

- Pages projets : 10 des 13 images de contenu de Barryland ont `alt="Image"`. Les noms de fichiers, eux, sont descriptifs (`chiots-saint-bernard-martigny`).
- Accueil : la plupart des images ont un `alt` vide. Le logo s'appelle « logo ».
- Logos clients : correctement nommés (« Fondation Barry », « HES-SO »…).
- Le sitemap déclare le namespace `image:` sans l'utiliser.

## 7. Préparation recherche IA (GEO) — 55/100 (partiel)

**Ce qui fonctionne**
- robots.txt ne bloque aucun robot d'IA.
- Un `/llms.txt` semble exister : l'URL renvoie un texte qui décrit l'agence et ses sections. À confirmer avec un navigateur.
- Entité claire et cohérente sur les annuaires (Infomaniak, local.ch, BuiltWith) : même nom et même adresse.
- Expertise affichée : deux articles récents sur le GEO.

**Constats**
- Le pare-feu peut bloquer les robots d'IA (voir la partie technique). C'est le point le plus important pour la visibilité dans ChatGPT, Perplexity et Claude.
- Pas de passages citables de type « question → réponse courte » sur les pages de services. Pas de FAQ.
- Pas de chiffres propres à l'agence (projets livrés, années, clients, satisfaction du support) que les IA pourraient reprendre.
- Homonymie forte : « Boomerang » désigne beaucoup d'entreprises (boomerang.ae, Boomerang DM, Boomerang Partners…). Des données `Organization` avec `sameAs`, et l'usage systématique de « Boomerang Marketing SA, Sierre », aident les moteurs à lever l'ambiguïté.
- Le cordonnier mal chaussé : l'agence publie des conseils GEO, mais son propre site n'applique pas encore plusieurs de ces conseils (dates, auteurs, preuves, FAQ).

## 8. SEO local

- Même nom, même adresse et même téléphone (NAP) sur le site, Infomaniak et local.ch. Bon point.
- Aucun lien vers une fiche Google Business Profile, aucun avis affiché, aucune carte intégrée.
- local.ch affiche le statut « Fermé » : à vérifier, ce sont probablement des horaires manquants. Renseigner les horaires d'ouverture des deux bureaux partout.
- Pages Sierre et Lausanne à transformer en vraies pages locales (voir le plan d'action).

---

## Méthode

- claude-seo v2.6.0 installé avec `install.sh` (tag `v2.6.0`) : 26 skills, 19 agents et un environnement Python isolé dans `~/.claude/skills/seo/`.
- `render_page.py` : échec. Le script refuse le proxy local de la session, et le serveur cible refuse de toute façon les connexions.
- PageSpeed Insights API : HTTP 429, quota épuisé.
- Lectures de contenu via WebFetch : accueil, robots.txt, `/fr/sitemap.xml`, `/sitemap.xml`, `/llms.txt`, Prestations, L'agence, Blog, Contact, Contact Sierre, Projets, Barryland, Hébergement, Plan du site, un article.
- 3 recherches web (moteur basé aux États-Unis, donc à confirmer sur google.ch en navigation privée).

Sources externes consultées : [fiche partenaire Infomaniak](https://www.infomaniak.com/fr/creer-un-site/professionnel/nos-agences-partenaires/2833), [local.ch Sierre marketing](https://www.local.ch/fr/q/sierre/marketing), [BuiltWith](https://trends.builtwith.com/agency/Boomerang-Marketing), [Clutch – Valais Web](https://clutch.co/profile/valais-web), [business-monitor.ch](https://business-monitor.ch/fr/cp/agences-de-communication/canton-du-valais).
