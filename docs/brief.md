# Project Brief: StackOverkill.io

---

## Executive Summary

**StackOverkill.io** est un outil web gratuit et ludique permettant de mesurer l'écart entre la complexité d'une infrastructure IT et les besoins métier réels qu'elle sert.

**Problème adressé :** Les organisations peinent à évaluer objectivement si leur SI est sur-dimensionné (overkill) ou sous-dimensionné (underkill) par rapport à leurs besoins applicatifs réels.

**Marché cible :** Professionnels IT (CTO, Lead Dev, Ops/Sysadmin) cherchant une évaluation rapide et fun de leur stack technique.

**Proposition de valeur :** En 5 minutes, obtenez un diagnostic visuel et partageable de l'adéquation de votre infrastructure, tout en alimentant un funnel vers des services d'expertise (Freelance) et une solution SaaS (KaliaOps).

---

## Problem Statement

### État actuel et points de douleur

Les organisations IT font face à un défi chronique : **évaluer objectivement l'adéquation entre leur infrastructure et leurs besoins métier réels**. Ce problème se manifeste sous deux formes :

- **Overkill** : Infrastructure sur-dimensionnée (ex: cluster Kubernetes pour un site vitrine, coût 100K€/mois pour 50€ de revenus)
- **Underkill** : Infrastructure sous-dimensionnée (ex: machine critique standalone sans backup = risque d'arrêt total)

### Impact du problème

- **Coûts gaspillés** : Budgets IT mal alloués, ROI flou
- **Risques opérationnels** : Pannes, pertes de données, interruptions business
- **Silos organisationnels** : Lead Dev et Ops n'ont pas la même vision de la situation
- **Décisions non-informées** : Absence de métriques claires pour justifier les choix d'infrastructure

### Pourquoi les solutions existantes échouent

- **Outils d'audit classiques** : Lourds, coûteux, longs à mettre en place
- **Consultants** : Chers, pas accessibles pour une évaluation rapide
- **Autoévaluation** : Subjective, biaisée, pas comparable
- **Aucun outil fun/viral** : Le sujet est traité comme "sérieux corporate" exclusivement

### Urgence

Dans un contexte de pression budgétaire IT croissante et de complexification des stacks (cloud, conteneurisation, cybersécurité), le besoin d'un outil d'évaluation rapide et accessible n'a jamais été aussi fort.

---

## Proposed Solution

### Concept core

StackOverkill.io est un outil web 100% déclaratif qui permet à un utilisateur de :

1. **Déclarer** les caractéristiques de son application (criticité, utilisateurs, revenus)
2. **Déclarer** les caractéristiques de son infrastructure (hébergement, coût, stack technique, équipe)
3. **Recevoir** un diagnostic visuel instantané de l'écart APP vs INFRA
4. **Partager** son résultat sur LinkedIn en 1 clic

### Différenciateurs clés

| Aspect | StackOverkill | Solutions classiques |
|--------|---------------|---------------------|
| **Ton** | Fun, ludique, décalé | Corporate, sérieux |
| **Prix** | Gratuit | Payant / consulting |
| **Durée** | 5 minutes | Jours/semaines |
| **Partageabilité** | Viral (LinkedIn, badges) | Rapports internes |
| **Data** | 100% déclaratif, privacy-first | Accès systèmes requis |

### Pourquoi ça va marcher

1. **Pas de friction** : Aucune intégration, aucun accès système requis
2. **Gratification instantanée** : Résultat visuel immédiat + badge partageable
3. **Viralité native** : Les écarts de perception entre collègues créent du débat et des re-tests
4. **Funnel naturel** : Les problèmes révélés mènent aux solutions (Freelance / KaliaOps)

### Vision produit

Devenir le "PageSpeed Insights" de l'infrastructure IT : un standard de référence pour évaluer rapidement l'adéquation SI/besoins.

---

## Target Users

### Primary User Segment: Professionnels IT décisionnaires

**Profil :**
- CTO, Directeur IT, VP Engineering
- Entreprises de 50 à 5000 employés
- Responsables de budgets et décisions infrastructure

**Comportements actuels :**
- Jonglent entre pression budgétaire et demandes techniques
- Manquent de visibilité objective sur l'état réel de leur SI
- Utilisent des outils comme PageSpeed, GTmetrix pour le web

**Pain points :**
- "Est-ce qu'on dépense trop pour ce qu'on fait ?"
- "Comment justifier nos choix d'infrastructure ?"
- "Comment comparer notre setup à l'industrie ?"

**Goals :**
- Avoir une vue rapide et objective de la situation
- Pouvoir communiquer simplement avec les équipes et la direction
- Identifier les axes d'optimisation

### Secondary User Segment: Contributeurs techniques

**Profil :**
- Lead Dev, Tech Lead, Ops, Sysadmin
- Directement impliqués dans les choix techniques quotidiens
- Influenceurs internes (pas décisionnaires budget)

**Comportements actuels :**
- Voient les posts LinkedIn de collègues et veulent tester
- Ont une vision partielle (Lead = APP, Ops = INFRA)
- Aiment les outils qui valident leur expertise

**Pain points :**
- "La direction ne comprend pas la complexité de notre infra"
- "On fait avec ce qu'on a, mais c'est pas optimal"
- "Comment montrer qu'on a besoin de plus/moins ?"

**Goals :**
- Valider leur perception avec un outil externe
- Avoir des arguments pour discussions internes
- Se détendre 5 minutes avec un outil fun

---

## Goals & Success Metrics

### Business Objectives

- **Acquisition** : Atteindre 10 000 tests complétés dans les 3 premiers mois
- **Viralité** : Obtenir un coefficient viral > 1.2 (chaque utilisateur amène 1.2+ nouveaux)
- **Conversion Freelance** : Générer 5+ leads qualifiés/mois vers services Freelance
- **Conversion SaaS** : Générer 10+ signups KaliaOps/mois via StackOverkill
- **Notoriété** : Établir StackOverkill comme référence dans la communauté IT francophone

### User Success Metrics

- **Complétion** : >80% des utilisateurs terminent le test une fois commencé
- **Partage** : >30% des utilisateurs partagent leur résultat sur LinkedIn
- **Retour** : >15% des utilisateurs reviennent pour un second test (autre perspective)
- **Satisfaction** : NPS > 40 sur l'expérience utilisateur

### Key Performance Indicators (KPIs)

- **Tests/jour** : Nombre de tests complétés quotidiennement (cible: 100+/jour à M+3)
- **Taux de partage LinkedIn** : % de résultats partagés (cible: 30%)
- **Coeff. viral** : Nouveaux users issus de partages / users ayant partagé (cible: >1.2)
- **CTR vers Freelance** : % de clics sur CTA Freelance (cible: 5%)
- **CTR vers KaliaOps** : % de clics sur CTA KaliaOps (cible: 8%)
- **Coût par lead** : Budget marketing / leads générés (cible: <10€)

---

## MVP Scope

### Core Features (Must Have)

- **Formulaire déclaratif APP** : Criticité (5 niveaux), nombre d'utilisateurs (slider/input), revenus générés (fourchettes)

- **Formulaire déclaratif INFRA** : Type hébergement (on-prem/cloud/hybride), coût mensuel (fourchettes), stack technique (checkboxes: baremetal, VMs, Docker, K8S, etc.), taille équipe technique, présence documentation (oui/non/partielle)

- **Algorithme de scoring** : Score APP (0-100), score INFRA (0-100), calcul d'écart, détermination du verdict (Overkill/Underkill/Équilibré)

- **Page de résultat visuelle** : Affichage graphique des scores, verdict avec couleur (vert/orange/rouge), badge généré dynamiquement, explication du résultat

- **Partage LinkedIn 1-clic** : Génération d'image de résultat, texte pré-rempli personnalisable, intégration API LinkedIn share

- **CTAs conversion** : Lien vers profil Freelance (contextuel si Overkill), lien vers KaliaOps (contextuel si problème organisation/CMDB)

- **Privacy by design** : Aucune donnée stockée par défaut (suppression après 1h), opt-in explicite pour conservation

### Out of Scope for MVP

- Leaderboard / classements (Phase 2)
- Analyses détaillées par pôle (Phase 2)
- Comptes utilisateurs / authentification
- Intégrations API externes (Terraform, AWS, etc.) - **explicitement exclu**
- Version mobile native
- Multi-langue (MVP en français uniquement)
- Feature premium "Audit personnalisé" (Phase 3)
- Historique des tests
- Comparaison entre tests

### MVP Success Criteria

Le MVP est considéré comme réussi si, dans les 30 jours suivant le lancement :

1. **1000+ tests complétés** sans intervention marketing payante
2. **Taux de partage LinkedIn > 20%**
3. **Au moins 1 lead Freelance généré**
4. **Aucun incident de sécurité/privacy**
5. **Temps de complétion moyen < 5 minutes**

---

## Post-MVP Vision

### Phase 2 Features

**Leaderboard gamifié :**
- Classement des infras les plus Overkill / les plus Underkill
- Système de mock nicknames et appnames (anonymisation)
- Opt-in uniquement pour apparaître

**Analyses détaillées par pôle :**
- Breakdown du score par dimension (APP détaillé, INFRA détaillé)
- Recommandations basiques par catégorie
- Feature de rétention pour utilisateurs récurrents

**Multi-prisme organisationnel :**
- Possibilité de tester la même orga avec différentes perspectives
- Comparaison des scores Lead vs Ops vs CTO
- Révélateur de silos (feature à forte valeur ajoutée)

### Long-term Vision (12-24 mois)

- **Référence industrie** : StackOverkill devient le standard pour évaluer l'adéquation SI/besoins
- **Communauté** : Base d'utilisateurs engagés qui partagent et comparent
- **Data insights** : Benchmarks anonymisés par industrie/taille d'entreprise (opt-in)
- **Écosystème** : Intégration naturelle avec KaliaOps pour les utilisateurs qui veulent passer à l'action
- **Internationalisation** : Version anglaise pour marché global

### Expansion Opportunities

- **Verticales sectorielles** : Versions adaptées (StackOverkill for Startups, for Enterprise, for Agencies)
- **Partenariats** : Intégration dans des blogs/médias tech comme outil interactif
- **API publique** : Permettre l'embedding du test sur d'autres sites (avec attribution)
- **Certifications fun** : "Certified Not Overkill" badges pour les organisations équilibrées
- **Events** : Classements live lors de conférences tech

---

## Technical Considerations

### Platform Requirements

- **Target Platforms:** Web application (responsive, mobile-friendly)
- **Browser Support:** Chrome, Firefox, Safari, Edge (versions récentes)
- **Performance Requirements:**
  - Time to Interactive < 3s
  - Résultat calculé < 500ms
  - Image de partage générée < 2s

### Technology Preferences

- **Frontend:** Framework JS moderne (React, Vue, ou Svelte) - à définir
- **Backend:** Node.js ou Python (léger, serverless-friendly)
- **Database:** Minimale (données éphémères) - Redis ou simple file storage
- **Hosting/Infrastructure:**
  - Cloud-based (Vercel, Netlify, ou Cloudflare Pages pour le frontend)
  - Serverless functions pour le backend
  - CDN pour les assets et images générées

### Architecture Considerations

- **Repository Structure:** Monorepo simple (frontend + backend/functions)
- **Service Architecture:**
  - JAMstack / serverless first
  - Pas de serveur persistant si possible
  - Stateless by design
- **Integration Requirements:**
  - LinkedIn Share API
  - Génération d'images dynamiques (Canvas API ou service tiers)
- **Security/Compliance:**
  - OWASP Top 10
  - RGPD compliant by design (no data = no problem)
  - HTTPS only
  - CSP headers stricts
  - Rate limiting pour éviter les abus

---

## Constraints & Assumptions

### Constraints

- **Budget:** Minimal - l'outil doit être rentabilisé par le funnel, pas par lui-même
- **Timeline:** MVP à livrer rapidement pour valider le concept
- **Resources:** Développeur solo (Romain) + potentiellement freelances ponctuels
- **Technical:**
  - Pas d'intégration avec systèmes externes (choix délibéré)
  - Infrastructure légère pour minimiser les coûts
  - Doit tenir la charge en cas de viralité

### Key Assumptions

- Les professionnels IT sont prêts à passer 5 minutes sur un outil "fun" lié à leur métier
- Le format "test + résultat partageable" fonctionne pour cette audience (comme les tests de personnalité)
- Les écarts de perception entre rôles (Lead vs Ops) existent réellement et créeront de l'engagement
- Le bouche-à-oreille LinkedIn est un canal d'acquisition viable pour cette cible
- Les utilisateurs qui découvrent un problème seront réceptifs aux solutions proposées (Freelance/KaliaOps)
- Le positionnement "gratuit + fun" ne décrédibilise pas la valeur perçue

---

## Risks & Open Questions

### Key Risks

- **Viralité insuffisante** : Si le coefficient viral est < 1, l'acquisition dépendra de marketing payant
  - Mitigation : Itérer rapidement sur l'UX de partage, tester différents formats de badges

- **Crédibilité du scoring** : Si les utilisateurs trouvent le score "à côté de la plaque", perte de confiance
  - Mitigation : Calibrer avec des cas réels, être transparent sur la méthodologie

- **Infrastructure qui ne tient pas** : Ironie suprême si StackOverkill est victime de son propre problème
  - Mitigation : Architecture serverless auto-scalante, monitoring proactif

- **Adoption par les Ops** : Cette population peut être sceptique/critique
  - Mitigation : S'assurer que le prisme INFRA est crédible et valorisant

- **Cannibalisation** : Les utilisateurs utilisent l'outil mais ne convertissent pas vers Freelance/KaliaOps
  - Mitigation : CTAs contextuels et pertinents, pas agressifs

### Open Questions

- Quels critères exacts pour le score APPLICATION au-delà de criticité/users/revenus ?
- Quels critères exacts pour le score INFRASTRUCTURE ?
- Comment calibrer les pondérations de chaque critère ?
- Quel design visuel pour maximiser le partage ?
- Faut-il une landing page séparée ou le test est-il la landing page ?
- Comment mesurer précisément l'attribution des conversions (Freelance/KaliaOps) ?

### Areas Needing Further Research

- **Benchmark concurrence** : Y a-t-il des outils similaires sur le marché anglophone ?
- **LinkedIn API limitations** : Quelles sont les contraintes de l'API de partage ?
- **Génération d'images** : Quelle solution technique pour générer les badges/résultats ?
- **Psychologie du partage** : Qu'est-ce qui fait qu'un résultat de test est partagé vs gardé privé ?
- **Calibration scoring** : Collecter des cas réels pour valider les seuils

---

## Appendices

### A. Research Summary

**Source principale :** Session de brainstorming du 2026-01-19 (voir `docs/brainstorming-session-results.md`)

**Techniques utilisées :**
- First Principles Thinking
- Role Playing (CTO, Lead Dev, Ops)
- What If Scenarios
- Mind Mapping

**Insights clés issus du brainstorming :**
1. Le positionnement "fun first" est différenciateur
2. Le déclaratif est une feature, pas une limitation
3. Les écarts de perspective créent de l'engagement
4. Privacy by design = avantage compétitif
5. Le funnel vers Freelance/KaliaOps est naturel

### B. Stakeholder Input

**Product Owner / Fondateur :** Romain
- Vision claire du positionnement et du business model
- Expertise technique infrastructure (Freelance Systèmes/Virtualisation)
- Propriétaire de KaliaOps (SaaS ITSM/CMDB/GED)

### C. References

- Session de brainstorming : `docs/brainstorming-session-results.md`
- KaliaOps (SaaS cible du funnel) : [À documenter]
- Profil Freelance : [À documenter]

---

## Next Steps

### Immediate Actions

1. **Valider le Project Brief** avec relecture et ajustements
2. **Définir les critères de scoring précis** (session dédiée Business Analyst)
3. **Choisir la stack technique** (frontend/backend/hosting)
4. **Créer les wireframes** du parcours utilisateur
5. **Prototyper l'algorithme de scoring** avec des cas de test
6. **Designer le badge/visuel de résultat** pour maximiser le partage

### PM Handoff

Ce Project Brief fournit le contexte complet pour **StackOverkill.io**. L'étape suivante est la création du PRD (Product Requirements Document) qui détaillera les spécifications fonctionnelles et techniques pour le développement du MVP.

---

*Document généré le 2026-01-19 - BMAD-METHOD*
