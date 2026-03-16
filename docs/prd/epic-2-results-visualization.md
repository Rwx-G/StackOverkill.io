# Epic 2: Results & Visualization

## Goal

Transformer la page de résultat basique en une expérience visuelle impactante et mémorable. Inclut les visualisations graphiques des scores, la génération dynamique d'un badge/image, et une explication détaillée du diagnostic.

## Related Requirements

**Functional Requirements:**
- FR14-FR17: Page de résultat

**Non-Functional Requirements:**
- NFR2: Affichage du résultat < 500ms
- NFR3: Génération de l'image < 2s
- NFR10: Responsive design

---

## Story 2.1: Visual Score Display

**As a** user,
**I want** to see my scores displayed as visual graphics,
**so that** I can quickly understand my situation at a glance.

### Acceptance Criteria

1. Score APPLICATION affiché avec une jauge ou barre de progression visuelle
2. Score INFRASTRUCTURE affiché avec une jauge ou barre de progression similaire
3. Visualisation comparative des deux scores (côte à côte ou superposés)
4. Animation d'apparition des scores (compteur qui monte ou reveal progressif)
5. Couleurs des jauges cohérentes avec le verdict global
6. Design responsive fonctionnel sur mobile
7. Accessibilité : valeurs numériques lisibles par screen readers

### Technical Notes

- Components: `ScoreGauge`, `ScoreComparison`, `AnimatedCounter`
- Animation: CSS transitions ou Framer Motion
- Accessibilité: `aria-valuenow`, `aria-valuemin`, `aria-valuemax`

---

## Story 2.2: Verdict Display & Explanation

**As a** user,
**I want** to see a clear verdict with an explanation,
**so that** I understand what my scores mean concretely.

### Acceptance Criteria

1. Verdict affiché de manière proéminente (grande typographie, couleur distinctive)
2. Icône ou illustration accompagnant le verdict (ex: emoji, illustration custom)
3. Texte d'explication généré dynamiquement basé sur le contexte
4. Explication différente selon le verdict (7 niveaux)
5. Ton de l'explication : fun mais informatif (pas corporate)
6. Au moins 3 variations de texte par verdict pour éviter la répétition
7. Mention des principaux facteurs ayant contribué au score

### Technical Notes

- Components: `VerdictHero`, `VerdictExplanation`
- Data: Messages et variations dans `packages/shared/src/content/verdicts.ts`
- Logic: Sélection de variation basée sur les inputs dominants

**Verdicts et tons:**
- OVERKILL_SEVERE: Alarmiste mais bienveillant
- OVERKILL: Humoristique ("Ferrari pour aller chercher le pain")
- SLIGHT_OVERKILL: Rassurant avec suggestion
- BALANCED: Félicitations enthousiastes
- SLIGHT_UNDERKILL: Alerte légère
- UNDERKILL: Préoccupation constructive
- UNDERKILL_SEVERE: Urgence avec solutions

---

## Story 2.3: Badge Image Generation

**As a** user,
**I want** a shareable badge image generated from my results,
**so that** I can easily share my results on social media.

### Acceptance Criteria

1. Image de badge générée dynamiquement côté serveur (API backend)
2. Badge inclut : logo StackOverkill, scores APP et INFRA, verdict
3. Dimensions optimisées pour LinkedIn (1200x630)
4. Design visuel attrayant et lisible même en miniature
5. URL unique pour chaque badge généré (paramètres encodés)
6. Temps de génération < 2 secondes
7. Format PNG optimisé
8. Badge visible/prévisualisable sur la page de résultat

### Technical Notes

- API: `GET /api/v1/og/badge?app=XX&infra=XX&verdict=XX`
- Technology: @vercel/og (Satori) pour génération JSX → PNG
- Caching: Cache des images générées (CDN ou filesystem)
- Fallback: Image statique en cas d'erreur

---

## Story 2.4: Results Page Polish

**As a** user,
**I want** a polished and complete results experience,
**so that** I feel satisfied and want to engage further.

### Acceptance Criteria

1. Layout finalisé de la page de résultat avec hiérarchie visuelle claire
2. Section "Comprendre votre score" avec détails expandables (optionnel)
3. Animation de transition fluide depuis le formulaire
4. Micro-interactions sur les éléments interactifs (hover, focus)
5. Message d'encouragement ou call-to-action secondaire selon le verdict
6. Design cohérent avec le reste de l'application
7. Performance : page de résultat charge en < 1s (hors génération badge)

### Technical Notes

- Components: `ResultsLayout`, `ScoreDetails`, `Accordion`
- Animation: Page transitions avec Next.js App Router
- Performance: Lazy loading des sections non-critiques

---

## Definition of Done (Epic 2)

- [ ] Toutes les stories complétées avec leurs critères d'acceptation
- [ ] Visualisations testées sur mobile et desktop
- [ ] Génération de badge fonctionnelle et performante
- [ ] Accessibilité validée (WCAG AA)
- [ ] Code review effectuée
- [ ] Documentation des composants
