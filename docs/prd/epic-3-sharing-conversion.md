# Epic 3: Sharing & Conversion

## Goal

Implémenter les mécanismes de viralité (partage LinkedIn) et de conversion (CTAs vers Freelance et KaliaOps). C'est l'epic qui transforme l'outil en machine à leads.

## Related Requirements

**Functional Requirements:**
- FR18-FR21: Partage LinkedIn
- FR22-FR24: CTAs de conversion
- FR25-FR28: Privacy et données

**Non-Functional Requirements:**
- NFR4-NFR7: Sécurité
- NFR12: Conformité RGPD

---

## Story 3.1: LinkedIn Share Integration

**As a** user,
**I want** to share my results on LinkedIn with one click,
**so that** I can show my results to my professional network.

### Acceptance Criteria

1. Bouton "Partager sur LinkedIn" visible et proéminent sur la page résultat
2. Clic ouvre le share dialog LinkedIn avec contenu pré-rempli
3. Texte de partage par défaut : accrocheur, inclut le verdict, inclut le lien
4. Image de badge attachée au partage (via Open Graph meta tags)
5. Lien de partage inclut un paramètre de tracking (utm_source=linkedin_share)
6. Fonctionnel sur mobile et desktop
7. Fallback gracieux si LinkedIn non disponible

### Technical Notes

- URL: `https://www.linkedin.com/sharing/share-offsite/?url=...`
- OG Tags dynamiques via Next.js generateMetadata
- UTM: `?utm_source=linkedin&utm_medium=share&utm_campaign=result`

---

## Story 3.2: Share Text Customization

**As a** user,
**I want** to customize the share text before posting,
**so that** I can add my personal touch to the share.

### Acceptance Criteria

1. Zone de texte éditable affichant le message de partage par défaut
2. Utilisateur peut modifier le texte librement
3. Limite de caractères visible (LinkedIn limit ~3000)
4. Bouton "Partager" qui ouvre LinkedIn avec le texte personnalisé
5. Option "Réinitialiser" pour revenir au texte par défaut
6. Prévisualisation du rendu (texte + image)
7. Texte personnalisé non sauvegardé (session only)

### Technical Notes

- Components: `ShareEditor`, `SharePreview`
- State: Local component state (pas de persistence)
- Encoding: URL encoding du texte pour LinkedIn share URL

---

## Story 3.3: Conversion CTAs Implementation

**As a** business owner,
**I want** relevant CTAs displayed based on the user's results,
**so that** interested users can discover my services.

### Acceptance Criteria

1. Section CTAs affichée sous le résultat principal (non intrusive)
2. CTA Freelance : lien vers profil/page de contact, texte contextuel
3. CTA KaliaOps : lien vers le SaaS, texte contextuel
4. Logique de contextualisation :
   - OVERKILL → emphasis sur optimisation (Freelance)
   - UNDERKILL → emphasis sur structuration (Freelance + KaliaOps)
   - ÉQUILIBRÉ → mentions légères des deux
5. Design des CTAs : cards ou boutons secondaires, pas de popup/modal
6. Tracking des clics sur les CTAs (analytics event)
7. CTAs fonctionnels avec liens corrects

### Technical Notes

- Components: `CTASection`, `CTACard`
- Logic: Sélection de CTA basée sur verdict dans `packages/shared`
- Analytics: Custom events pour tracking

**Mapping Verdict → CTA:**
```
OVERKILL_SEVERE → Freelance (optimisation urgente)
OVERKILL → Freelance (optimisation)
SLIGHT_OVERKILL → Freelance (review léger)
BALANCED → Les deux (maintenance)
SLIGHT_UNDERKILL → Freelance + KaliaOps
UNDERKILL → Freelance + KaliaOps (structuration)
UNDERKILL_SEVERE → Freelance + KaliaOps (urgence)
```

---

## Story 3.4: Open Graph & SEO Optimization

**As a** user sharing my results,
**I want** the shared link to display a rich preview,
**so that** my post looks professional and attracts clicks.

### Acceptance Criteria

1. Meta tags Open Graph configurés pour la page de résultat
2. og:image pointe vers le badge généré dynamiquement
3. og:title inclut le verdict ou un hook accrocheur
4. og:description résume le concept de StackOverkill
5. Twitter Card meta tags également configurés
6. Preview testée et validée avec les outils de debug (LinkedIn Post Inspector)
7. Page d'accueil également optimisée (OG tags génériques)

### Technical Notes

- Implementation: Next.js `generateMetadata` avec paramètres dynamiques
- Route pour résultat partageable: `/result/[encodedParams]`
- Image URL: Absolue vers l'API de génération de badge

**Meta tags requis:**
```html
<meta property="og:title" content="Mon diagnostic StackOverkill: OVERKILL!" />
<meta property="og:description" content="Découvre si ton infra est overkill en 2 minutes" />
<meta property="og:image" content="https://stackoverkill.io/api/v1/og/badge?..." />
<meta property="og:url" content="https://stackoverkill.io/result/..." />
<meta name="twitter:card" content="summary_large_image" />
```

---

## Story 3.5: Privacy Consent & Data Handling

**As a** user,
**I want** to understand how my data is handled and give consent if needed,
**so that** I feel confident using the tool.

### Acceptance Criteria

1. Mention claire sur la page de résultat : "Vos données ne sont pas conservées"
2. Checkbox optionnelle : "Participer au leaderboard (anonymisé)"
3. Si checkbox cochée : génération de mock nickname et mock appname
4. Système de génération de nicknames fun et mémorables
5. Données conservées uniquement si opt-in explicite
6. Lien vers page de politique de confidentialité
7. Page de politique de confidentialité rédigée (RGPD compliant)

### Technical Notes

- Components: `PrivacyNotice`, `LeaderboardOptIn`
- API: `POST /api/v1/leaderboard` (opt-in only)
- Storage: JSON file `data/leaderboard.json`
- Nickname generator: Combinaisons adjective + animal (ex: "SwiftPanda42")

**Structure LeaderboardEntry:**
```typescript
interface LeaderboardEntry {
  id: string;
  nickname: string;
  appName: string;
  scoreApp: number;
  scoreInfra: number;
  verdict: VerdictType;
  createdAt: string;
}
```

---

## Definition of Done (Epic 3)

- [ ] Toutes les stories complétées avec leurs critères d'acceptation
- [ ] Partage LinkedIn testé et fonctionnel
- [ ] OG tags validés avec LinkedIn Post Inspector
- [ ] CTAs trackés dans analytics
- [ ] Privacy policy rédigée et accessible
- [ ] Code review effectuée
- [ ] Tests d'intégration pour le flow de partage
