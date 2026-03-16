# StackOverkill.io - AI UI Generation Prompts

Ce document contient des prompts optimisés pour générer l'interface utilisateur avec des outils AI comme **v0.dev**, **Lovable.dev**, ou similaires.

## Stratégie recommandée

1. **Générer écran par écran** — Ne pas tout faire en un seul prompt
2. **Itérer** — Affiner chaque écran avant de passer au suivant
3. **Review humain obligatoire** — Tout code généré doit être revu et testé

---

## Prompt 1 : Landing Page

```
# Project Context

You are building **StackOverkill.io** - a fun, viral web tool that helps IT professionals evaluate if their infrastructure is overkill (or underkill) compared to their actual business needs. The tone is playful, tech-savvy, and slightly provocative.

## Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS (no component library)
- **Fonts**: Inter (body), Space Grotesk (headlines)
- **Icons**: Lucide React

## Design Tokens
- Primary: #6366F1 (Indigo)
- Accent: #F97316 (Orange) - for CTAs
- Background: #F8FAFC
- Text: #0F172A
- Text secondary: #475569

---

# High-Level Goal

Create a responsive, mobile-first landing page that hooks visitors and converts them to start the test. The page should feel fun and modern, not corporate.

# Detailed Instructions

1. Create a new page component at `app/page.tsx`
2. Structure the page with these sections (top to bottom):
   - **Header**: Minimal - just the logo/wordmark "StackOverkill" on the left, no navigation
   - **Hero Section** (full viewport height on mobile):
     - Fun illustration or emoji composition (use 🚀💥🔥 as placeholder)
     - Main headline: "Ton infra est-elle OVERKILL ?" (use Space Grotesk, extra bold, 48px mobile)
     - Subheadline: "Découvre en 2 minutes si ta stack est adaptée à tes vrais besoins" (Inter, regular, muted color)
     - CTA Button: "Commencer le test" (large, orange accent, full width on mobile)
     - Time indicator: "~2 minutes" as a small badge below the button
   - **Footer**: Simple, muted - links "Mentions légales" and "Confidentialité"

3. Mobile-first responsive behavior:
   - Mobile (<768px): Single column, CTA full width, hero takes most of viewport
   - Tablet (768px+): Add more whitespace, center content with max-width
   - Desktop (1024px+): max-width 1200px, centered, more generous spacing

4. Add subtle hover animation on the CTA button (scale 1.02)
5. The CTA should link to `/test`

# Constraints

- Do NOT use any UI component library (no shadcn, no Material UI)
- Do NOT add a hamburger menu or complex navigation
- Use semantic HTML (header, main, footer)
- Ensure the CTA button has minimum 44x44px touch target
- Add appropriate meta tags for SEO (title, description)

# Code Structure

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header>...</header>
      <main className="flex-1 flex items-center justify-center">
        <HeroSection />
      </main>
      <footer>...</footer>
    </div>
  )
}

Only create/modify:
- `app/page.tsx`
- `components/landing/HeroSection.tsx` (optional extraction)

Do NOT create any other pages or components yet.
```

---

## Prompt 2 : Test Flow (Formulaires)

```
# Project Context

Continuing StackOverkill.io development. Same tech stack (Next.js 14, TypeScript, Tailwind CSS, Lucide icons).

## Design Tokens (same as before)
- Primary: #6366F1, Accent: #F97316, Success: #22C55E
- Background: #F8FAFC, Text: #0F172A

---

# High-Level Goal

Create a two-step form flow for the test. Step 1 collects "Application" data, Step 2 collects "Infrastructure" data. The form should feel like a fun quiz, not a boring survey.

# Detailed Instructions

## Page Structure

1. Create `app/test/page.tsx` as the main test page
2. Use React state to manage current step (1 or 2) and form data
3. Use Zustand store for persisting form data across steps (create `stores/scoreStore.ts`)

## Step 1: Application Form (7 questions)

Display questions using selectable cards (not radio buttons). Each card:
- Has an emoji on the left
- Has the option text
- Shows a checkmark when selected
- Has hover/focus states

Questions for APP (display one at a time or as a scrollable list):

1. **Criticité métier** - 5 options:
   - 😴 Très faible (side project, tests)
   - 😐 Faible (outil interne secondaire)
   - 😊 Moyenne (outil métier standard)
   - 😤 Haute (app critique quotidienne)
   - 🔥 Critique (cœur de métier, 24/7)

2. **Nombre d'utilisateurs** - 6 options:
   - 👤 1-10
   - 👥 11-50
   - 👥👥 51-200
   - 🏢 201-1000
   - 🏙️ 1001-5000
   - 🌍 5000+

3. **Impact financier** - 6 options:
   - 💸 Aucun
   - 💵 <100€/mois
   - 💰 100-1000€/mois
   - 💎 1000-10k€/mois
   - 🏦 10k-100k€/mois
   - 🚀 >100k€/mois

4. **Disponibilité requise** - 6 options:
   - 🤷 Best effort
   - 🕐 Heures ouvrées
   - 📊 99% (8h downtime/mois)
   - 📈 99.9%
   - 🎯 99.99%
   - ⚡ 99.999%

5. **Exposition** - 5 options:
   - 🔒 Interne uniquement
   - 🔐 Interne + VPN
   - ☁️ Cloud privé
   - 🌐 Public authentifié
   - 🌍 Public ouvert

6. **Complexité fonctionnelle** - 5 options:
   - 📝 Très simple (CRUD basique)
   - 📋 Simple
   - ⚙️ Moyenne
   - 🔧 Complexe
   - 🏗️ Très complexe (microservices)

7. **Sensibilité des données** - 4 options:
   - 📢 Publiques
   - 📁 Internes
   - 🔏 Confidentielles
   - 🛡️ Critiques (RGPD, santé, finance)

## Step 2: Infrastructure Form (7 questions)

Same card-based UI. Questions for INFRA:

1. **Sophistication technique** - 6 options:
   - 🖥️ Serveur unique basique
   - 📦 VM ou conteneur simple
   - 🐳 Docker Compose
   - ⚓ Orchestration (Swarm)
   - ☸️ Kubernetes
   - 🌌 Multi-cloud / Service mesh

2. **Résilience** - 6 options:
   - ❌ Aucune redondance
   - 💾 Backup manuel
   - 🔄 Backup automatisé
   - 🔁 Failover manuel
   - ⚡ Failover automatique
   - 🌍 Multi-région actif-actif

3. **Coût mensuel infra** - 6 options:
   - 🆓 Gratuit / personnel
   - 💵 1-50€
   - 💰 51-200€
   - 💎 201-1000€
   - 🏦 1001-5000€
   - 🚀 5000€+

4. **Capacité équipe** - 5 options:
   - 🧑 Solo (moi tout seul)
   - 👥 2-3 personnes
   - 🏢 4-10 personnes
   - 🏙️ 10+ avec spécialistes
   - 🌐 Équipe dédiée 24/7

5. **Maturité opérationnelle** - 5 options:
   - 😱 Aucune doc, YOLO
   - 📝 Doc partielle
   - 📚 Doc complète
   - 📊 Monitoring basique
   - 🎯 Observabilité complète

6. **Automatisation** - 5 options:
   - 🖱️ Tout manuel
   - 📜 Scripts basiques
   - 🔧 CI/CD partiel
   - ⚙️ CI/CD complet
   - 🤖 GitOps / IaC complet

7. **Niveau sécurité** - 4 options:
   - 🔓 Basique (firewall)
   - 🔒 Standard (HTTPS, auth)
   - 🛡️ Renforcée (WAF, scans)
   - 🏰 Avancée (Zero Trust, SIEM)

## UI Components Needed

1. **ProgressBar**: Shows "Étape 1/2 - Ton application" or "Étape 2/2 - Ton infrastructure" with visual progress bar
2. **QuestionCard**: Selectable card with emoji, text, selected state (border accent + checkmark)
3. **FormStep**: Container for a step with title and questions list

## Navigation

- "Suivant →" button at bottom (disabled until all questions answered, greyed out)
- Step 2 has "Voir mon résultat 🎯" instead
- Small back arrow (←) top left to return to previous step (subtle, not prominent)

## Animations

- Card selection: scale(0.98) → scale(1) with checkmark fade-in, 200ms
- Button enable: opacity transition
- Step transition: fade + slight slide left, 250ms

# Zustand Store Structure

interface ScoreStore {
  step: 1 | 2;
  appAnswers: {
    criticality?: number;
    userCount?: number;
    financialImpact?: number;
    availability?: number;
    exposure?: number;
    complexity?: number;
    dataSensitivity?: number;
  };
  infraAnswers: {
    sophistication?: number;
    resilience?: number;
    cost?: number;
    teamCapacity?: number;
    operationalMaturity?: number;
    automation?: number;
    security?: number;
  };
  setAppAnswer: (key: string, value: number) => void;
  setInfraAnswer: (key: string, value: number) => void;
  setStep: (step: 1 | 2) => void;
  reset: () => void;
  isAppComplete: () => boolean;
  isInfraComplete: () => boolean;
}

# Constraints

- All questions are required before enabling "Suivant"
- Touch targets minimum 44x44px
- Mobile-first: cards stack vertically, full width
- Do NOT submit to API yet (that's on submit of step 2)
- Preserve form state in Zustand (survives page refresh if using persist middleware)
- Keyboard accessible: cards focusable with Enter/Space to select
```

---

## Prompt 3 : Page Résultats

```
# Project Context

Continuing StackOverkill.io. Building the results page - the "wow moment" of the app.

## Tech Stack & Design Tokens (same as before)
- Primary: #6366F1, Accent: #F97316
- Success (Balanced): #22C55E
- Warning (Slight): #EAB308
- Error (Severe): #EF4444

---

# High-Level Goal

Create an impactful results page that displays the verdict dramatically, shows the scores visually, and encourages sharing on LinkedIn.

# Detailed Instructions

## Data Flow

1. Create `app/result/page.tsx`
2. On page load, read form data from Zustand store
3. If no data, redirect to `/test`
4. Call the scoring API: `POST /api/v1/score/calculate`
5. Display loading animation during calculation (2-3 seconds for dramatic effect)
6. Reveal results with animation

## API Contract

// Request body
{
  app: {
    criticality: 1-5,
    userCount: 1-6,
    financialImpact: 1-6,
    availability: 1-6,
    exposure: 1-5,
    complexity: 1-5,
    dataSensitivity: 1-4
  },
  infra: {
    sophistication: 1-6,
    resilience: 1-6,
    cost: 1-6,
    teamCapacity: 1-5,
    operationalMaturity: 1-5,
    automation: 1-5,
    security: 1-4
  }
}

// Response
{
  scoreApp: number,      // 0-100
  scoreInfra: number,    // 0-100
  gap: number,           // scoreInfra - scoreApp
  verdict: string,       // One of the 7 verdicts
  message: string        // Contextual fun message
}

## Verdict Types & Colors

| Verdict | Color | Emoji | Example Message |
|---------|-------|-------|-----------------|
| OVERKILL_SEVERE | #EF4444 | 🚨 | "Houston, on a un problème de budget..." |
| OVERKILL | #F97316 | 🏎️ | "Ferrari pour aller chercher le pain" |
| SLIGHT_OVERKILL | #EAB308 | 🤔 | "Un petit surplus, rien de grave" |
| BALANCED | #22C55E | ✨ | "Parfait équilibre, bravo !" |
| SLIGHT_UNDERKILL | #EAB308 | 😅 | "Ça passe... pour l'instant" |
| UNDERKILL | #F97316 | 😰 | "On joue avec le feu là" |
| UNDERKILL_SEVERE | #EF4444 | 💀 | "Miracle que ça tienne encore" |

## Page Layout (mobile-first)

1. **Header**: Logo only, centered

2. **Loading State** (shown during API call):
   - Centered spinner or pulsing animation
   - Text: "Calcul en cours..." with dots animation
   - Fun subtext: "On analyse ta stack..."

3. **Verdict Section** (hero, after loading):
   - Large verdict badge with color background
   - Verdict text in white, bold, 36-48px
   - Associated emoji large (64px)
   - Entrance animation: scale 0.8→1.0 with bounce easing

4. **Scores Display**:
   - Two horizontal gauges, side by side on desktop, stacked on mobile
   - Left gauge: "APP" label, colored bar, numeric value
   - Right gauge: "INFRA" label, colored bar, numeric value
   - Gap indicator between them showing the difference
   - Animated fill from 0 to final value over 1.5s

5. **Explanation Section**:
   - The contextual message from API
   - Styled as a quote or callout box
   - Fun, informal tone

6. **Action Section**:
   - Primary CTA: "📤 Partager sur LinkedIn" (large orange button)
   - Secondary: "🔄 Refaire le test" (outline button)
   - Checkbox below: "☐ Participer au leaderboard (anonyme)"

7. **CTA Cards Section** (below main content):
   - Two cards side by side (stacked on mobile)
   - Card 1: "💡 Besoin d'optimiser ?" → Link to Freelance
   - Card 2: "📊 Envie de structurer ?" → Link to KaliaOps
   - Contextual: show different emphasis based on verdict

## Components to Create

1. **LoadingAnimation**: Fun spinner with text
2. **VerdictBadge**: The big colored verdict display
3. **ScoreGauge**: Animated horizontal bar with label and value
4. **ShareSection**: Contains share button and leaderboard opt-in
5. **CTACard**: Service promotion card

## Animations

- Loading dots: 3 dots with staggered opacity animation
- Verdict reveal: scale(0.8) → scale(1.0), cubic-bezier(0.34, 1.56, 0.64, 1), 400ms
- Score gauge fill: width 0% → X%, ease-out, 1500ms
- Score number: count from 0 to final value, 1500ms
- Cards fade in: opacity 0→1, staggered 100ms each

# Share Button Behavior

On click:
1. Open LinkedIn share URL in new tab
2. URL format: https://www.linkedin.com/sharing/share-offsite/?url={encoded_url}
3. The URL to share: https://stackoverkill.io/result?app={scoreApp}&infra={scoreInfra}&verdict={verdict}
4. This URL will have OG meta tags that show the badge image

# Constraints

- Redirect to `/test` if Zustand store has no data
- The share flow is simple for now (no customization modal yet)
- Mobile: scores stack vertically
- Ensure gauges have aria labels for accessibility
- Loading state should last minimum 2 seconds even if API is faster (for drama)
```

---

## Prompt 4 : Composants Partagés

```
# Project Context

Creating shared UI components for StackOverkill.io that will be used across multiple pages.

## Tech Stack
- Next.js 14, TypeScript, Tailwind CSS, Lucide React
- No UI component library

## Design Tokens
- Primary: #6366F1
- Accent: #F97316
- Success: #22C55E
- Warning: #EAB308
- Error: #EF4444
- Background: #F8FAFC
- Text: #0F172A
- Text muted: #475569
- Border: #E2E8F0

---

# High-Level Goal

Create a small set of reusable, accessible UI components following the project's design system.

# Components to Create

## 1. Button (`components/ui/Button.tsx`)

Variants: primary, secondary, ghost, icon
Sizes: sm, md, lg
States: default, hover, active, focus, disabled, loading

Props:
- variant: 'primary' | 'secondary' | 'ghost' | 'icon'
- size: 'sm' | 'md' | 'lg'
- loading?: boolean
- disabled?: boolean
- leftIcon?: ReactNode
- rightIcon?: ReactNode
- children: ReactNode
- ...rest (button HTML attributes)

Styling:
- Primary: bg-accent (orange), text-white, hover:scale-102
- Secondary: border-2 border-primary, text-primary, hover:bg-primary/5
- Ghost: text-primary, hover:bg-primary/10
- Loading: show spinner, disable interactions
- Focus: ring-2 ring-primary ring-offset-2
- All sizes: minimum 44px height for touch

## 2. Card (`components/ui/Card.tsx`)

A simple container with optional selection state.

Props:
- selected?: boolean
- onClick?: () => void
- children: ReactNode
- className?: string

Styling:
- Default: bg-white, border border-gray-200, rounded-xl, p-4
- Hover: border-primary/50, shadow-sm
- Selected: border-2 border-primary, bg-primary/5
- Transition on all state changes

## 3. ProgressBar (`components/ui/ProgressBar.tsx`)

Shows step progress.

Props:
- currentStep: number
- totalSteps: number
- labels?: string[] (optional labels for each step)

Styling:
- Container: h-2, bg-gray-200, rounded-full
- Fill: bg-primary, rounded-full, transition-all
- Labels above if provided

## 4. Badge (`components/ui/Badge.tsx`)

Small label/tag component.

Props:
- variant: 'default' | 'success' | 'warning' | 'error' | 'info'
- size: 'sm' | 'md'
- children: ReactNode

Styling:
- Rounded-full, px-3 py-1
- Colors based on variant
- Text small and medium weight

## 5. Modal (`components/ui/Modal.tsx`)

Overlay dialog.

Props:
- isOpen: boolean
- onClose: () => void
- title?: string
- children: ReactNode
- size?: 'sm' | 'md' | 'lg'

Features:
- Backdrop click to close
- Escape key to close
- Focus trap
- Animate in/out (fade + scale)
- Mobile: full width with margin

# Constraints

- All components must be keyboard accessible
- Use forwardRef where appropriate
- Export from `components/ui/index.ts`
- Include JSDoc comments for props
- No external dependencies beyond Lucide for icons
```

---

## Notes d'utilisation

### Pour v0.dev

1. Copiez un prompt dans v0.dev
2. Laissez générer
3. Itérez avec des instructions de modification
4. Exportez le code et intégrez-le dans votre projet

### Pour Lovable.dev

1. Créez un nouveau projet avec le tech stack approprié
2. Utilisez les prompts section par section
3. Affinez chaque écran avant de passer au suivant

### Review obligatoire

⚠️ **Tout code généré par AI doit être :**
- Relu par un développeur humain
- Testé manuellement
- Vérifié pour l'accessibilité
- Adapté aux conventions du projet

---

*Document généré le 2026-01-20 par Sally (UX Expert) — BMAD-METHOD*
