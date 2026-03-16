# Epic 1: Foundation & Core Flow

## Goal

Établir les fondations techniques du projet et implémenter le parcours utilisateur principal : du formulaire déclaratif jusqu'au calcul des scores APP et INFRA. À la fin de cet epic, un utilisateur peut remplir le formulaire et voir ses scores calculés.

## Related Requirements

**Functional Requirements:**
- FR1-FR4: Formulaire déclaratif APPLICATION
- FR5-FR10: Formulaire déclaratif INFRASTRUCTURE
- FR11-FR13: Algorithme de scoring et verdict

**Non-Functional Requirements:**
- NFR1: Time to Interactive < 3s
- NFR2: Calcul du score < 500ms
- NFR10-NFR11: Responsive et cross-browser
- NFR13-NFR14: Maintenabilité et logs

---

## Story 1.1: Project Setup & Infrastructure

**As a** developer,
**I want** a properly configured project with CI/CD pipeline,
**so that** I can develop and deploy the application efficiently.

### Acceptance Criteria

1. Repository Git initialisé avec structure monorepo (`/apps/frontend`, `/apps/backend`, `/packages/shared`, `/docs`)
2. Framework frontend installé et configuré (Next.js 14 + TypeScript + Tailwind CSS)
3. Backend Node.js/Express configuré avec TypeScript
4. Configuration ESLint + Prettier pour la qualité de code
5. Pipeline CI/CD configuré (GitLab CI/CD)
6. Dockerfiles multi-stage pour frontend et backend
7. docker-compose.yml pour le développement local
8. Déploiement automatique sur push vers main
9. Page "Hello World" accessible sur l'URL de production
10. README avec instructions de setup local

### Technical Notes

- Stack: Next.js 14, Node.js/Express, TypeScript, Tailwind CSS
- Build: Turborepo + pnpm workspaces
- Container: Docker multi-stage builds
- CI/CD: GitLab CI/CD avec GitLab Container Registry

---

## Story 1.2: Landing Page & Navigation Shell

**As a** visitor,
**I want** to see an attractive landing page that explains the tool,
**so that** I understand what StackOverkill does and want to start the test.

### Acceptance Criteria

1. Landing page avec headline accrocheur ("Ton infra est-elle overkill ?")
2. Sous-titre expliquant le concept en 1 phrase
3. Bouton CTA proéminent "Commencer le test" (ou équivalent)
4. Indication du temps estimé (~2 min)
5. Design responsive (mobile-first)
6. Navigation shell en place (header minimal avec logo/nom)
7. Footer avec liens légaux (mentions légales, privacy — pages placeholder)

### Technical Notes

- Route: `/` (Next.js App Router)
- Components: `Header`, `Footer`, `HeroSection`
- State: Aucun state global requis

---

## Story 1.3: Application Form (Score APP)

**As a** user,
**I want** to answer questions about my application,
**so that** the tool can evaluate my application's requirements.

### Acceptance Criteria

1. Écran de formulaire pour la section APPLICATION
2. Question criticité : sélection parmi 5 niveaux (Très faible → Critique)
3. Question utilisateurs : slider ou sélection parmi les plages définies (1-10, 11-50, 51-200, 201-1000, 1001-5000, 5000+)
4. Question impact financier : sélection parmi les fourchettes définies
5. Question disponibilité requise : sélection parmi les niveaux
6. Question exposition : sélection parmi les niveaux
7. Question complexité fonctionnelle : sélection parmi les niveaux
8. Question sensibilité des données : sélection parmi les niveaux
9. Indicateur de progression visible (ex: "Étape 1/2")
10. Validation des champs avec Zod
11. Bouton "Suivant" pour passer à la section INFRA
12. Design cohérent avec la landing page
13. État du formulaire préservé via Zustand

### Technical Notes

- Route: `/test` ou `/test/app`
- Components: `FormStep`, `RadioGroup`, `ProgressBar`
- State: Zustand store `useScoreStore`
- Validation: Zod schemas dans `packages/shared`

---

## Story 1.4: Infrastructure Form (Score INFRA)

**As a** user,
**I want** to answer questions about my infrastructure,
**so that** the tool can evaluate my infrastructure's complexity.

### Acceptance Criteria

1. Écran de formulaire pour la section INFRASTRUCTURE
2. Question sophistication technique : sélection parmi les niveaux
3. Question résilience : sélection parmi les niveaux
4. Question coût mensuel : sélection parmi les fourchettes définies
5. Question capacité équipe : sélection parmi les options
6. Question maturité opérationnelle : sélection parmi les niveaux
7. Question niveau d'automatisation : sélection parmi les niveaux
8. Question niveau de sécurité : sélection parmi les niveaux
9. Indicateur de progression (ex: "Étape 2/2")
10. Validation des champs avec Zod
11. Bouton "Voir mon résultat" pour déclencher le calcul
12. Possibilité de revenir à l'étape précédente sans perte de données

### Technical Notes

- Route: `/test/infra`
- Components: Réutilisation de `FormStep`, `RadioGroup`, `ProgressBar`
- State: Zustand store `useScoreStore`
- Validation: Zod schemas dans `packages/shared`

---

## Story 1.5: Scoring Algorithm Implementation

**As a** user,
**I want** my inputs to be converted into meaningful scores,
**so that** I get an accurate evaluation of my situation.

### Acceptance Criteria

1. Fonction de calcul du score APPLICATION (0-100) implémentée selon la méthodologie
2. Fonction de calcul du score INFRASTRUCTURE (0-100) implémentée selon la méthodologie
3. Pondération des critères selon `docs/scoring-methodology.md`
4. Fonction de calcul de l'écart APP vs INFRA
5. Fonction de détermination du verdict (7 niveaux de OVERKILL_SEVERE à UNDERKILL_SEVERE)
6. Seuils configurables selon la méthodologie
7. Tests unitaires couvrant tous les cas limites (score min, max, seuils)
8. Tests unitaires pour chaque combinaison de verdict
9. Implémentation dans `packages/shared` pour réutilisation front/back

### Technical Notes

- Location: `packages/shared/src/scoring/`
- Tests: Vitest avec couverture >80%
- Types: Interfaces TypeScript pour inputs/outputs

**Pondérations APP:**
- Criticité: 25%
- Nombre d'utilisateurs: 15%
- Impact financier: 20%
- Disponibilité requise: 15%
- Exposition: 10%
- Complexité fonctionnelle: 10%
- Sensibilité des données: 5%

**Pondérations INFRA:**
- Sophistication technique: 20%
- Résilience: 20%
- Coût: 15%
- Capacité équipe: 15%
- Maturité opérationnelle: 15%
- Automatisation: 10%
- Sécurité: 5%

---

## Story 1.6: Basic Results Display

**As a** user,
**I want** to see my scores after completing the form,
**so that** I know the result of my evaluation.

### Acceptance Criteria

1. Page de résultat affichée après soumission du formulaire
2. Affichage du score APPLICATION (valeur numérique 0-100)
3. Affichage du score INFRASTRUCTURE (valeur numérique 0-100)
4. Affichage de l'écart entre les deux scores
5. Affichage du verdict avec libellé et message
6. Code couleur basique pour le verdict (vert/orange/rouge selon gravité)
7. Bouton "Refaire le test" pour recommencer
8. Données non persistées par défaut (refresh = retour au début)

### Technical Notes

- Route: `/result`
- API: `POST /api/v1/score/calculate`
- Components: `ScoreDisplay`, `VerdictBadge`
- State: Résultat stocké temporairement dans Zustand

---

## Definition of Done (Epic 1)

- [ ] Toutes les stories complétées avec leurs critères d'acceptation
- [ ] Tests unitaires passants (couverture >80% sur scoring)
- [ ] Pipeline CI/CD fonctionnel
- [ ] Application déployée et accessible
- [ ] Code review effectuée
- [ ] Documentation technique à jour
