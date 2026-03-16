# Epic 4: Polish & Launch Prep

## Goal

Finaliser l'expérience utilisateur, optimiser les performances, corriger les bugs, et préparer le lancement public. L'application doit être prête pour la viralité.

## Related Requirements

**Non-Functional Requirements:**
- NFR1: Time to Interactive < 3s
- NFR4-NFR7: Sécurité (OWASP, HTTPS, CSP, rate limiting)
- NFR8-NFR9: Scalabilité
- NFR10-NFR11: Compatibilité navigateurs
- NFR12: Conformité RGPD
- NFR13-NFR14: Maintenabilité et logs

---

## Story 4.1: Performance Optimization

**As a** user,
**I want** the application to load and respond quickly,
**so that** I have a smooth experience without frustration.

### Acceptance Criteria

1. Audit Lighthouse avec score > 90 sur Performance
2. Time to Interactive < 3 secondes sur 3G rapide
3. Bundle size optimisé (code splitting si nécessaire)
4. Images optimisées (WebP, lazy loading si applicable)
5. Fonts optimisées (subset, preload)
6. Cache headers configurés correctement
7. Pas de layout shift visible (CLS < 0.1)

### Technical Notes

- Tools: Lighthouse CI dans le pipeline
- Next.js: Automatic code splitting, Image optimization
- Fonts: `next/font` avec subset
- Caching: Headers via Nginx reverse proxy

**Targets:**
- FCP (First Contentful Paint): < 1.5s
- LCP (Largest Contentful Paint): < 2.5s
- TTI (Time to Interactive): < 3s
- CLS (Cumulative Layout Shift): < 0.1
- TBT (Total Blocking Time): < 200ms

---

## Story 4.2: Error Handling & Edge Cases

**As a** user,
**I want** the application to handle errors gracefully,
**so that** I don't get stuck or confused if something goes wrong.

### Acceptance Criteria

1. Gestion des erreurs réseau (retry, message utilisateur)
2. Gestion des erreurs de génération d'image (fallback statique)
3. Gestion du rate limiting (message approprié, countdown)
4. Page 404 personnalisée avec design cohérent
5. Page d'erreur générique (500) personnalisée
6. Validation côté client robuste (pas de soumission de données invalides)
7. Logs d'erreurs côté serveur pour debugging

### Technical Notes

- Next.js: `error.tsx` et `not-found.tsx` dans App Router
- Backend: Winston logger avec niveaux (error, warn, info)
- Rate limiting: Message "Trop de requêtes, réessayez dans X secondes"
- Retry: Exponential backoff pour les appels API

---

## Story 4.3: Analytics Integration

**As a** product owner,
**I want** to track user behavior and conversions,
**so that** I can measure the success and iterate.

### Acceptance Criteria

1. Solution analytics privacy-friendly intégrée (Plausible ou équivalent)
2. Tracking des pages vues
3. Tracking des événements clés :
   - Test démarré (`test_started`)
   - Test complété (`test_completed`)
   - Partage LinkedIn cliqué (`share_linkedin`)
   - CTA Freelance cliqué (`cta_freelance`)
   - CTA KaliaOps cliqué (`cta_kaliaops`)
   - Leaderboard opt-in (`leaderboard_optin`)
4. Pas de cookies tiers (RGPD friendly)
5. Dashboard analytics accessible
6. Documentation des events trackés

### Technical Notes

- Provider: Plausible Analytics (self-hosted option available)
- Implementation: Script tag + custom events
- No cookies: Plausible est cookieless par défaut

**Events schema:**
```typescript
interface AnalyticsEvent {
  name: string;
  props?: {
    verdict?: string;
    score_app?: number;
    score_infra?: number;
  };
}
```

---

## Story 4.4: Mobile Experience Polish

**As a** mobile user,
**I want** a smooth and native-feeling experience,
**so that** I can complete the test easily on my phone.

### Acceptance Criteria

1. Test complet du parcours sur iOS Safari et Android Chrome
2. Touch targets suffisamment grands (min 44x44px)
3. Pas de zoom involontaire sur les inputs (font-size >= 16px)
4. Scroll fluide sans saccades
5. Partage LinkedIn fonctionnel depuis mobile
6. Badge visible correctement sur petit écran
7. Aucun élément coupé ou débordant sur les tailles d'écran communes

### Technical Notes

- Testing: BrowserStack ou devices physiques
- CSS: `touch-action: manipulation` pour éviter les délais
- Inputs: `font-size: 16px` minimum pour éviter le zoom iOS
- Viewport: Meta viewport correctement configuré

**Breakpoints cibles:**
- Mobile S: 320px
- Mobile M: 375px
- Mobile L: 425px
- Tablet: 768px
- Desktop: 1024px+

---

## Story 4.5: Legal Pages & Launch Checklist

**As a** product owner,
**I want** all legal and compliance requirements met,
**so that** I can launch publicly without legal risks.

### Acceptance Criteria

1. Page "Mentions légales" complète (identité éditeur, hébergeur)
2. Page "Politique de confidentialité" complète (RGPD)
3. Liens accessibles depuis le footer sur toutes les pages
4. Vérification HTTPS sur toutes les pages
5. Test de sécurité basique (headers, pas de failles évidentes)
6. Favicon et meta tags complets
7. Sitemap.xml généré
8. robots.txt configuré
9. Checklist de lancement validée

### Technical Notes

- Routes: `/mentions-legales`, `/confidentialite`
- Sitemap: Généré automatiquement par Next.js
- Security headers: Via Nginx (CSP, X-Frame-Options, etc.)

**Launch Checklist:**
- [ ] DNS configuré
- [ ] SSL/TLS actif
- [ ] Monitoring en place
- [ ] Backup configuré
- [ ] Rate limiting actif
- [ ] Analytics fonctionnel
- [ ] OG tags validés
- [ ] Mobile testé
- [ ] Cross-browser testé
- [ ] Performance validée (Lighthouse > 90)

---

## Story 4.6: Final QA & Bug Fixes

**As a** product owner,
**I want** a bug-free application,
**so that** users have a professional experience at launch.

### Acceptance Criteria

1. Test end-to-end du parcours complet (landing → formulaire → résultat → partage)
2. Test sur les navigateurs cibles (Chrome, Firefox, Safari, Edge)
3. Test sur mobile (iOS, Android)
4. Correction de tous les bugs bloquants identifiés
5. Correction des bugs majeurs UX identifiés
6. Revue du contenu (typos, formulations)
7. Validation finale du design par rapport aux intentions
8. Green light pour le lancement

### Technical Notes

- QA: Tests manuels + E2E automatisés (Playwright)
- Bug tracking: Issues GitLab
- Definition of Blocker: Empêche le parcours principal
- Definition of Major: Dégrade significativement l'UX

**Test Matrix:**
| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome | ✓ | ✓ (Android) |
| Firefox | ✓ | - |
| Safari | ✓ | ✓ (iOS) |
| Edge | ✓ | - |

---

## Definition of Done (Epic 4)

- [ ] Toutes les stories complétées avec leurs critères d'acceptation
- [ ] Lighthouse score > 90 sur toutes les métriques
- [ ] Zero bugs bloquants
- [ ] Pages légales en place
- [ ] Analytics fonctionnel
- [ ] Tests E2E passants
- [ ] Launch checklist 100% complète
- [ ] Go/No-Go meeting validé
