# StackOverkill.io Product Requirements Document (PRD)

---

## Goals and Background Context

### Goals

- **Valider le concept viral** : Prouver que le format "test + résultat partageable" fonctionne pour l'audience IT
- **Générer du trafic qualifié** : Attirer des professionnels IT vers l'écosystème (Freelance + KaliaOps)
- **Établir la notoriété** : Positionner StackOverkill comme référence pour l'évaluation rapide SI/besoins
- **Livrer un MVP fonctionnel** : Application web complète permettant test, résultat et partage LinkedIn
- **Respecter le positionnement** : Gratuit, fun, 5 minutes, privacy-first, zéro intégration externe

### Background Context

StackOverkill.io répond à un problème récurrent dans les organisations IT : l'absence d'outil simple et accessible pour évaluer objectivement l'adéquation entre l'infrastructure technique et les besoins métier réels. Les solutions existantes (audits, consultants, outils enterprise) sont lourdes, coûteuses et inaccessibles pour une évaluation rapide.

Le projet se différencie par son positionnement "fun first" : un outil gratuit et ludique qui génère un diagnostic visuel partageable en 5 minutes. Le modèle 100% déclaratif (l'utilisateur déclare sa perception) élimine les problèmes de sécurité/privacy et crée naturellement de l'engagement via les écarts de perception entre collègues. Le business model repose sur un funnel vers les services Freelance (expertise infrastructure) et le SaaS KaliaOps (ITSM/CMDB/GED).

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-01-19 | 0.1 | Création initiale du PRD | Mary (BA) |

---

## Requirements

### Functional Requirements

**Formulaire déclaratif APPLICATION**

- **FR1**: L'utilisateur peut sélectionner un niveau de criticité parmi 5 options : Très faible, Faible, Moyenne, Haute, Critique
- **FR2**: L'utilisateur peut indiquer le nombre d'utilisateurs de l'application via un slider ou input (plages : 1-10, 11-50, 51-200, 201-1000, 1001-5000, 5000+)
- **FR3**: L'utilisateur peut indiquer les revenus générés par l'application via des fourchettes (0€, 1-100€/mois, 101-1000€/mois, 1001-10000€/mois, 10000+€/mois)
- **FR4**: Le système calcule un score APPLICATION de 0 à 100 basé sur les critères pondérés

**Formulaire déclaratif INFRASTRUCTURE**

- **FR5**: L'utilisateur peut sélectionner le type d'hébergement : On-premise, Cloud, Hybride
- **FR6**: L'utilisateur peut indiquer le coût mensuel d'infrastructure via des fourchettes (0€/gratuit, 1-50€, 51-200€, 201-1000€, 1001-5000€, 5000+€)
- **FR7**: L'utilisateur peut sélectionner les éléments de stack technique via checkboxes multiples : Serveur physique dédié, VMs/Hyperviseur, Conteneurs Docker, Docker Swarm, Kubernetes, CI/CD Pipeline, CDN, Load Balancer, Base de données managée, Cache distribué
- **FR8**: L'utilisateur peut indiquer la taille de l'équipe technique (1, 2-3, 4-10, 10+)
- **FR9**: L'utilisateur peut indiquer le niveau de documentation : Aucune, Partielle, Complète
- **FR10**: Le système calcule un score INFRASTRUCTURE de 0 à 100 basé sur les critères pondérés

**Algorithme de scoring et verdict**

- **FR11**: Le système calcule l'écart entre le score APP et le score INFRA
- **FR12**: Le système détermine un verdict basé sur l'écart : OVERKILL (INFRA > APP + 20), UNDERKILL (APP > INFRA + 20), ÉQUILIBRÉ (écart < 20)
- **FR13**: Le système génère une explication textuelle du verdict adaptée au contexte

**Page de résultat**

- **FR14**: La page de résultat affiche les deux scores (APP et INFRA) de manière visuelle (jauges, barres, ou graphique)
- **FR15**: La page de résultat affiche le verdict avec un code couleur : Vert (équilibré), Orange (léger écart), Rouge (overkill/underkill significatif)
- **FR16**: La page de résultat génère dynamiquement un badge/image représentant le résultat
- **FR17**: La page de résultat affiche une explication du diagnostic en langage accessible

**Partage LinkedIn**

- **FR18**: L'utilisateur peut partager son résultat sur LinkedIn en 1 clic
- **FR19**: Le partage LinkedIn inclut une image générée du résultat
- **FR20**: Le partage LinkedIn inclut un texte pré-rempli personnalisable par l'utilisateur
- **FR21**: Le texte de partage inclut un lien vers StackOverkill.io

**CTAs de conversion**

- **FR22**: La page de résultat affiche un CTA vers le profil Freelance, contextualisé si le diagnostic révèle un besoin d'expertise
- **FR23**: La page de résultat affiche un CTA vers KaliaOps, contextualisé si le diagnostic révèle un problème d'organisation/documentation
- **FR24**: Les CTAs sont non-intrusifs et apparaissent après le contenu principal du résultat

**Privacy et données**

- **FR25**: Par défaut, aucune donnée utilisateur n'est stockée de manière persistante
- **FR26**: Les données de session sont automatiquement supprimées après 1 heure
- **FR27**: L'utilisateur peut opter pour la conservation de ses données via une checkbox explicite
- **FR28**: Si l'utilisateur opte pour la conservation, le système génère un mock nickname et mock appname pour l'anonymisation

### Non-Functional Requirements

**Performance**

- **NFR1**: Le temps de chargement initial de l'application (Time to Interactive) doit être inférieur à 3 secondes
- **NFR2**: Le calcul du score et l'affichage du résultat doivent s'effectuer en moins de 500ms
- **NFR3**: La génération de l'image de partage doit s'effectuer en moins de 2 secondes

**Sécurité**

- **NFR4**: L'application doit respecter les recommandations OWASP Top 10
- **NFR5**: Toutes les communications doivent être chiffrées via HTTPS
- **NFR6**: L'application doit implémenter des headers CSP (Content Security Policy) stricts
- **NFR7**: L'application doit implémenter un rate limiting pour prévenir les abus

**Scalabilité**

- **NFR8**: L'architecture doit supporter un pic de 1000 utilisateurs simultanés sans dégradation
- **NFR9**: L'infrastructure doit pouvoir auto-scaler en cas de viralité

**Compatibilité**

- **NFR10**: L'application doit être responsive et fonctionner sur mobile, tablette et desktop
- **NFR11**: L'application doit être compatible avec Chrome, Firefox, Safari et Edge (versions récentes)

**Conformité**

- **NFR12**: L'application doit être conforme RGPD par design (minimisation des données, consentement explicite)

**Maintenabilité**

- **NFR13**: Le code doit suivre les bonnes pratiques et être documenté pour faciliter les évolutions
- **NFR14**: L'application doit inclure des logs pour le monitoring et le debugging

---

## User Interface Design Goals

### Overall UX Vision

L'expérience utilisateur doit être **fun, rapide et gratifiante**. L'utilisateur doit pouvoir compléter le test en moins de 5 minutes avec un sentiment de découverte ludique, pas de corvée administrative. Le ton visuel est décalé et moderne, inspiré des outils viraux type "quel personnage es-tu" mais avec une vraie valeur professionnelle derrière.

L'interface doit créer un **"wow moment"** au moment du résultat : visuel impactant, verdict clair, envie immédiate de partager.

### Key Interaction Paradigms

- **Progressive disclosure** : Les questions apparaissent une par une ou par blocs logiques, pas un formulaire monolithique intimidant
- **Feedback instantané** : Chaque sélection donne un feedback visuel immédiat
- **Gamification légère** : Progression visible (étapes, barre de progression), micro-animations
- **One-click actions** : Partage, copie, navigation — tout doit être accessible en 1 clic
- **Mobile-first** : Conçu pour le pouce, adapté au desktop

### Core Screens and Views

1. **Landing / Intro Screen**
   - Hook accrocheur ("Ton infra est-elle overkill ?")
   - CTA clair pour démarrer le test
   - Indication du temps (~2 min)

2. **Formulaire APP Screen**
   - Questions sur l'application (criticité, users, revenus)
   - Progression visible
   - Transition fluide vers la section suivante

3. **Formulaire INFRA Screen**
   - Questions sur l'infrastructure
   - Progression visible
   - Animation de "calcul" avant le résultat

4. **Results Screen**
   - Affichage visuel des scores (le hero moment)
   - Verdict avec couleur et explication
   - Badge/image générée
   - Boutons de partage proéminents
   - CTAs conversion (Freelance / KaliaOps) en dessous

5. **Share Preview (optionnel)**
   - Prévisualisation du post LinkedIn
   - Personnalisation du texte
   - Confirmation avant partage

### Accessibility

**WCAG AA** - L'application doit respecter les critères d'accessibilité WCAG 2.1 niveau AA :
- Contraste suffisant pour le texte et les éléments interactifs
- Navigation au clavier fonctionnelle
- Labels et attributs ARIA appropriés
- Pas de dépendance exclusive aux couleurs pour transmettre l'information

### Branding

- **Ton** : Décalé, tech-savvy, légèrement provocateur ("overkill", "éclaté")
- **Palette** : À définir — suggéré : couleurs vives et contrastées, pas corporate
- **Typographie** : Moderne, lisible, avec personnalité (type Inter, Space Grotesk, ou similaire)
- **Iconographie** : Simple, ligne, moderne
- **Nom** : StackOverkill.io — le ".io" renforce le positionnement tech/startup

### Target Device and Platforms

**Web Responsive** — Application web optimisée pour :
- Mobile (priorité) : 375px - 428px
- Tablette : 768px - 1024px
- Desktop : 1024px+

Pas d'application native prévue pour le MVP.

---

## Technical Assumptions

### Repository Structure

**Monorepo** — Un seul repository contenant :
- `/frontend` : Application web (SPA)
- `/functions` ou `/api` : Serverless functions pour le backend léger
- `/shared` : Types et utilitaires partagés (si applicable)
- `/docs` : Documentation projet

Rationale : Projet de taille modeste, un seul développeur, simplicité de gestion et déploiement.

### Service Architecture

**JAMstack / Serverless** :
- Frontend statique (SPA) déployé sur CDN (Vercel, Netlify, ou Cloudflare Pages)
- Backend minimal via serverless functions (génération d'images, éventuellement analytics)
- Pas de serveur persistant
- Pas de base de données traditionnelle (données éphémères en mémoire ou Redis si nécessaire)

Rationale : Coûts minimaux, scalabilité automatique, simplicité opérationnelle, adapté au modèle "no data".

### Technology Stack (Suggestions)

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend Framework** | Vue 3 ou React | Écosystème mature, bonne DX, SSR possible |
| **Styling** | Tailwind CSS | Rapidité de développement, design system intégré |
| **Build Tool** | Vite | Performance, DX moderne |
| **Backend/Functions** | Node.js (Vercel/Netlify Functions) | Simple, même langage que le frontend |
| **Image Generation** | Canvas API ou Satori + Resvg | Génération d'images côté serveur |
| **Hosting** | Vercel ou Cloudflare Pages | CDN global, serverless intégré, CI/CD automatique |
| **Analytics** | Plausible ou Simple Analytics | Privacy-friendly, RGPD compliant |

*Note : Stack finale à valider avec l'Architecte*

### Testing Requirements

**Unit + Integration** :
- Tests unitaires pour l'algorithme de scoring (critique)
- Tests d'intégration pour le flow complet (formulaire → résultat)
- Tests E2E optionnels pour les parcours critiques (Playwright/Cypress)
- Pas de tests manuels formalisés pour le MVP

Coverage cible : >80% sur l'algorithme de scoring, >60% global.

### Additional Technical Assumptions

- **Pas d'authentification** : Aucun compte utilisateur pour le MVP
- **Pas de base de données persistante** : Données éphémères uniquement
- **API LinkedIn** : Utilisation du share URL standard (pas d'OAuth complexe)
- **Internationalisation** : Français uniquement pour le MVP, architecture prête pour i18n futur
- **SEO** : Meta tags optimisés, Open Graph pour les previews de partage
- **Monitoring** : Logs applicatifs basiques, alerting sur erreurs critiques

---

## Epic List

### Vue d'ensemble des Epics

| Epic | Titre | Objectif |
|------|-------|----------|
| **Epic 1** | Foundation & Core Flow | Établir le projet, implémenter le formulaire et l'algorithme de scoring |
| **Epic 2** | Results & Visualization | Créer la page de résultat avec visualisation et génération de badge |
| **Epic 3** | Sharing & Conversion | Implémenter le partage LinkedIn et les CTAs de conversion |
| **Epic 4** | Polish & Launch Prep | Finaliser l'UX, optimiser les performances, préparer le lancement |

**Rationale** : 4 epics séquentiels qui livrent chacun une valeur incrémentale :
- Epic 1 : On peut tester et voir un score
- Epic 2 : On peut voir un résultat visuel complet
- Epic 3 : On peut partager et convertir
- Epic 4 : Produit prêt pour le lancement public

---

## Epic 1: Foundation & Core Flow

### Goal

Établir les fondations techniques du projet et implémenter le parcours utilisateur principal : du formulaire déclaratif jusqu'au calcul des scores APP et INFRA. À la fin de cet epic, un utilisateur peut remplir le formulaire et voir ses scores calculés.

---

### Story 1.1: Project Setup & Infrastructure

**As a** developer,
**I want** a properly configured project with CI/CD pipeline,
**so that** I can develop and deploy the application efficiently.

#### Acceptance Criteria

1. Repository Git initialisé avec structure monorepo (`/frontend`, `/docs`)
2. Framework frontend installé et configuré (Vue 3 ou React + Vite + Tailwind)
3. Configuration ESLint + Prettier pour la qualité de code
4. Pipeline CI/CD configuré (GitHub Actions → Vercel/Netlify)
5. Déploiement automatique sur push vers main
6. Page "Hello World" accessible sur l'URL de production
7. README avec instructions de setup local

---

### Story 1.2: Landing Page & Navigation Shell

**As a** visitor,
**I want** to see an attractive landing page that explains the tool,
**so that** I understand what StackOverkill does and want to start the test.

#### Acceptance Criteria

1. Landing page avec headline accrocheur ("Ton infra est-elle overkill ?")
2. Sous-titre expliquant le concept en 1 phrase
3. Bouton CTA proéminent "Commencer le test" (ou équivalent)
4. Indication du temps estimé (~2 min)
5. Design responsive (mobile-first)
6. Navigation shell en place (header minimal avec logo/nom)
7. Footer avec liens légaux (mentions légales, privacy — pages placeholder)

---

### Story 1.3: Application Form (Score APP)

**As a** user,
**I want** to answer questions about my application,
**so that** the tool can evaluate my application's requirements.

#### Acceptance Criteria

1. Écran de formulaire pour la section APPLICATION
2. Question criticité : sélection parmi 5 niveaux (Très faible → Critique)
3. Question utilisateurs : slider ou sélection parmi les plages définies
4. Question revenus : sélection parmi les fourchettes définies
5. Indicateur de progression visible (ex: "Étape 1/2")
6. Validation des champs (tous requis)
7. Bouton "Suivant" pour passer à la section INFRA
8. Design cohérent avec la landing page
9. État du formulaire préservé en mémoire (pas de perte si retour)

---

### Story 1.4: Infrastructure Form (Score INFRA)

**As a** user,
**I want** to answer questions about my infrastructure,
**so that** the tool can evaluate my infrastructure's complexity.

#### Acceptance Criteria

1. Écran de formulaire pour la section INFRASTRUCTURE
2. Question hébergement : sélection On-premise / Cloud / Hybride
3. Question coût : sélection parmi les fourchettes définies
4. Question stack technique : checkboxes multiples (liste définie dans FR7)
5. Question taille équipe : sélection parmi les options
6. Question documentation : sélection Aucune / Partielle / Complète
7. Indicateur de progression (ex: "Étape 2/2")
8. Validation des champs (tous requis sauf stack technique qui peut être vide)
9. Bouton "Voir mon résultat" pour déclencher le calcul
10. Possibilité de revenir à l'étape précédente sans perte de données

---

### Story 1.5: Scoring Algorithm Implementation

**As a** user,
**I want** my inputs to be converted into meaningful scores,
**so that** I get an accurate evaluation of my situation.

#### Acceptance Criteria

1. Fonction de calcul du score APPLICATION (0-100) implémentée
2. Fonction de calcul du score INFRASTRUCTURE (0-100) implémentée
3. Pondération des critères définie et documentée dans le code
4. Fonction de calcul de l'écart APP vs INFRA
5. Fonction de détermination du verdict (OVERKILL / UNDERKILL / ÉQUILIBRÉ)
6. Seuil de rupture configurable (défaut: 20 points)
7. Tests unitaires couvrant tous les cas limites (score min, max, seuils)
8. Tests unitaires pour chaque combinaison de verdict
9. Documentation de l'algorithme (commentaires ou doc séparée)

---

### Story 1.6: Basic Results Display

**As a** user,
**I want** to see my scores after completing the form,
**so that** I know the result of my evaluation.

#### Acceptance Criteria

1. Page de résultat affichée après soumission du formulaire
2. Affichage du score APPLICATION (valeur numérique)
3. Affichage du score INFRASTRUCTURE (valeur numérique)
4. Affichage de l'écart entre les deux scores
5. Affichage du verdict (OVERKILL / UNDERKILL / ÉQUILIBRÉ)
6. Code couleur basique pour le verdict (vert/orange/rouge)
7. Bouton "Refaire le test" pour recommencer
8. Données non persistées (refresh = retour au début)

---

## Epic 2: Results & Visualization

### Goal

Transformer la page de résultat basique en une expérience visuelle impactante et mémorable. Inclut les visualisations graphiques des scores, la génération dynamique d'un badge/image, et une explication détaillée du diagnostic.

---

### Story 2.1: Visual Score Display

**As a** user,
**I want** to see my scores displayed as visual graphics,
**so that** I can quickly understand my situation at a glance.

#### Acceptance Criteria

1. Score APPLICATION affiché avec une jauge ou barre de progression visuelle
2. Score INFRASTRUCTURE affiché avec une jauge ou barre de progression similaire
3. Visualisation comparative des deux scores (côte à côte ou superposés)
4. Animation d'apparition des scores (compteur qui monte ou reveal progressif)
5. Couleurs des jauges cohérentes avec le verdict global
6. Design responsive fonctionnel sur mobile
7. Accessibilité : valeurs numériques lisibles par screen readers

---

### Story 2.2: Verdict Display & Explanation

**As a** user,
**I want** to see a clear verdict with an explanation,
**so that** I understand what my scores mean concretely.

#### Acceptance Criteria

1. Verdict affiché de manière proéminente (grande typographie, couleur distinctive)
2. Icône ou illustration accompagnant le verdict (ex: emoji, illustration custom)
3. Texte d'explication généré dynamiquement basé sur le contexte
4. Explication différente selon le verdict (OVERKILL vs UNDERKILL vs ÉQUILIBRÉ)
5. Ton de l'explication : fun mais informatif (pas corporate)
6. Au moins 3 variations de texte par verdict pour éviter la répétition
7. Mention des principaux facteurs ayant contribué au score

---

### Story 2.3: Badge Image Generation

**As a** user,
**I want** a shareable badge image generated from my results,
**so that** I can easily share my results on social media.

#### Acceptance Criteria

1. Image de badge générée dynamiquement côté serveur (serverless function)
2. Badge inclut : logo StackOverkill, scores APP et INFRA, verdict
3. Dimensions optimisées pour LinkedIn (1200x627 ou 1080x1080)
4. Design visuel attrayant et lisible même en miniature
5. URL unique pour chaque badge généré (ou génération à la volée)
6. Temps de génération < 2 secondes
7. Format PNG ou JPG optimisé
8. Badge visible/prévisualisable sur la page de résultat

---

### Story 2.4: Results Page Polish

**As a** user,
**I want** a polished and complete results experience,
**so that** I feel satisfied and want to engage further.

#### Acceptance Criteria

1. Layout finalisé de la page de résultat avec hiérarchie visuelle claire
2. Section "Comprendre votre score" avec détails expandables (optionnel)
3. Animation de transition fluide depuis le formulaire
4. Micro-interactions sur les éléments interactifs (hover, focus)
5. Message d'encouragement ou call-to-action secondaire selon le verdict
6. Design cohérent avec le reste de l'application
7. Performance : page de résultat charge en < 1s (hors génération badge)

---

## Epic 3: Sharing & Conversion

### Goal

Implémenter les mécanismes de viralité (partage LinkedIn) et de conversion (CTAs vers Freelance et KaliaOps). C'est l'epic qui transforme l'outil en machine à leads.

---

### Story 3.1: LinkedIn Share Integration

**As a** user,
**I want** to share my results on LinkedIn with one click,
**so that** I can show my results to my professional network.

#### Acceptance Criteria

1. Bouton "Partager sur LinkedIn" visible et proéminent sur la page résultat
2. Clic ouvre le share dialog LinkedIn avec contenu pré-rempli
3. Texte de partage par défaut : accrocheur, inclut le verdict, inclut le lien
4. Image de badge attachée au partage (via Open Graph meta tags)
5. Lien de partage inclut un paramètre de tracking (utm_source=linkedin_share)
6. Fonctionnel sur mobile et desktop
7. Fallback gracieux si LinkedIn non disponible

---

### Story 3.2: Share Text Customization

**As a** user,
**I want** to customize the share text before posting,
**so that** I can add my personal touch to the share.

#### Acceptance Criteria

1. Zone de texte éditable affichant le message de partage par défaut
2. Utilisateur peut modifier le texte librement
3. Limite de caractères visible (LinkedIn limit)
4. Bouton "Partager" qui ouvre LinkedIn avec le texte personnalisé
5. Option "Réinitialiser" pour revenir au texte par défaut
6. Prévisualisation du rendu (texte + image)
7. Texte personnalisé non sauvegardé (session only)

---

### Story 3.3: Conversion CTAs Implementation

**As a** business owner,
**I want** relevant CTAs displayed based on the user's results,
**so that** interested users can discover my services.

#### Acceptance Criteria

1. Section CTAs affichée sous le résultat principal (non intrusive)
2. CTA Freelance : lien vers profil/page de contact, texte contextuel
3. CTA KaliaOps : lien vers le SaaS, texte contextuel
4. Logique de contextualisation :
   - OVERKILL → emphasis sur optimisation (Freelance)
   - UNDERKILL → emphasis sur structuration (Freelance + KaliaOps)
   - ÉQUILIBRÉ → mentions légères des deux
5. Design des CTAs : cards ou boutons secondaires, pas de popup/modal
6. Tracking des clics sur les CTAs (analytics event)
7. CTAs fonctionnels avec liens corrects (même si pages cibles placeholder)

---

### Story 3.4: Open Graph & SEO Optimization

**As a** user sharing my results,
**I want** the shared link to display a rich preview,
**so that** my post looks professional and attracts clicks.

#### Acceptance Criteria

1. Meta tags Open Graph configurés pour la page de résultat
2. og:image pointe vers le badge généré dynamiquement
3. og:title inclut le verdict ou un hook accrocheur
4. og:description résume le concept de StackOverkill
5. Twitter Card meta tags également configurés
6. Preview testée et validée avec les outils de debug (LinkedIn Post Inspector, Facebook Debugger)
7. Page d'accueil également optimisée (OG tags génériques)

---

### Story 3.5: Privacy Consent & Data Handling

**As a** user,
**I want** to understand how my data is handled and give consent if needed,
**so that** I feel confident using the tool.

#### Acceptance Criteria

1. Mention claire sur la page de résultat : "Vos données ne sont pas conservées"
2. Checkbox optionnelle : "Conserver mes résultats pour le leaderboard (anonymisé)"
3. Si checkbox cochée : génération de mock nickname et mock appname
4. Système de génération de nicknames fun et mémorables
5. Données conservées uniquement si opt-in explicite
6. Lien vers page de politique de confidentialité
7. Page de politique de confidentialité rédigée (RGPD compliant)

---

## Epic 4: Polish & Launch Prep

### Goal

Finaliser l'expérience utilisateur, optimiser les performances, corriger les bugs, et préparer le lancement public. L'application doit être prête pour la viralité.

---

### Story 4.1: Performance Optimization

**As a** user,
**I want** the application to load and respond quickly,
**so that** I have a smooth experience without frustration.

#### Acceptance Criteria

1. Audit Lighthouse avec score > 90 sur Performance
2. Time to Interactive < 3 secondes sur 3G rapide
3. Bundle size optimisé (code splitting si nécessaire)
4. Images optimisées (WebP, lazy loading si applicable)
5. Fonts optimisées (subset, preload)
6. Cache headers configurés correctement
7. Pas de layout shift visible (CLS < 0.1)

---

### Story 4.2: Error Handling & Edge Cases

**As a** user,
**I want** the application to handle errors gracefully,
**so that** I don't get stuck or confused if something goes wrong.

#### Acceptance Criteria

1. Gestion des erreurs réseau (retry, message utilisateur)
2. Gestion des erreurs de génération d'image (fallback)
3. Gestion du rate limiting (message approprié)
4. Page 404 personnalisée
5. Page d'erreur générique (500) personnalisée
6. Validation côté client robuste (pas de soumission de données invalides)
7. Logs d'erreurs côté serveur pour debugging

---

### Story 4.3: Analytics Integration

**As a** product owner,
**I want** to track user behavior and conversions,
**so that** I can measure the success and iterate.

#### Acceptance Criteria

1. Solution analytics privacy-friendly intégrée (Plausible, Simple Analytics, ou équivalent)
2. Tracking des pages vues
3. Tracking des événements clés :
   - Test démarré
   - Test complété
   - Partage LinkedIn cliqué
   - CTA Freelance cliqué
   - CTA KaliaOps cliqué
4. Pas de cookies tiers (RGPD friendly)
5. Dashboard analytics accessible
6. Documentation des events trackés

---

### Story 4.4: Mobile Experience Polish

**As a** mobile user,
**I want** a smooth and native-feeling experience,
**so that** I can complete the test easily on my phone.

#### Acceptance Criteria

1. Test complet du parcours sur iOS Safari et Android Chrome
2. Touch targets suffisamment grands (min 44x44px)
3. Pas de zoom involontaire sur les inputs
4. Scroll fluide sans saccades
5. Partage LinkedIn fonctionnel depuis mobile
6. Badge visible correctement sur petit écran
7. Aucun élément coupé ou débordant sur les tailles d'écran communes

---

### Story 4.5: Legal Pages & Launch Checklist

**As a** product owner,
**I want** all legal and compliance requirements met,
**so that** I can launch publicly without legal risks.

#### Acceptance Criteria

1. Page "Mentions légales" complète (identité éditeur, hébergeur)
2. Page "Politique de confidentialité" complète (RGPD)
3. Liens accessibles depuis le footer sur toutes les pages
4. Vérification HTTPS sur toutes les pages
5. Test de sécurité basique (headers, pas de failles évidentes)
6. Favicon et meta tags complets
7. Sitemap.xml généré
8. robots.txt configuré
9. Checklist de lancement validée

---

### Story 4.6: Final QA & Bug Fixes

**As a** product owner,
**I want** a bug-free application,
**so that** users have a professional experience at launch.

#### Acceptance Criteria

1. Test end-to-end du parcours complet (landing → formulaire → résultat → partage)
2. Test sur les navigateurs cibles (Chrome, Firefox, Safari, Edge)
3. Test sur mobile (iOS, Android)
4. Correction de tous les bugs bloquants identifiés
5. Correction des bugs majeurs UX identifiés
6. Revue du contenu (typos, formulations)
7. Validation finale du design par rapport aux maquettes/intentions
8. Green light pour le lancement

---

## Checklist Results Report

*À compléter après exécution de la checklist PM*

---

## Next Steps

### UX Expert Prompt

> Bonjour, je suis le Product Owner de StackOverkill.io. Le PRD est finalisé dans `docs/prd.md`. Merci de le consulter et de créer les wireframes/maquettes pour les écrans principaux : Landing, Formulaire APP, Formulaire INFRA, et Results. Le positionnement est "fun, rapide, viral" — l'UX doit refléter ce ton.

### Architect Prompt

> Bonjour, je suis le Product Owner de StackOverkill.io. Le PRD est finalisé dans `docs/prd.md` et le brief dans `docs/brief.md`. Merci de créer l'architecture technique en mode "create architecture". Stack suggérée : Vue 3 ou React + Vite + Tailwind, serverless sur Vercel/Cloudflare. Focus sur la simplicité, la performance, et la scalabilité en cas de viralité.

---

*Document généré le 2026-01-19 - BMAD-METHOD*
