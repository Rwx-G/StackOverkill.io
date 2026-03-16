# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-16

First public release on GitHub.

### Added

#### Quiz & Scoring
- 14-question diagnostic quiz (7 App, 7 Infrastructure)
- Weighted scoring algorithm with app/infra gap analysis
- 7 verdict levels: Overkill Severe → Balanced → Underkill Severe
- Verdict-specific advice and contextual CTAs

#### Result Sharing
- Dynamic shareable result cards (client-side generation)
- Server-side OG image generation (Satori + Sharp)
- One-click LinkedIn sharing with pre-filled text
- Unique shareable URLs per result (`/r/:id`)
- Static OG images for homepage and leaderboard

#### Leaderboard
- Global leaderboard with opt-in submissions
- Anonymized entries (nickname + app name only)
- Sorted by most extreme scores

#### Internationalization
- Full i18n support with 5 languages: EN, FR, DE, IT, ES
- Language auto-detection with manual override
- All UI text, verdicts, and legal pages translated

#### UI/UX
- Dark mode design with gradient backgrounds and animations
- Quiz transition animations and progress bar
- Mobile-first responsive layout
- Roast mode easter egg (brutally honest verdicts)

#### Infrastructure
- Monorepo architecture (Turborepo + pnpm workspaces)
- Shared TypeScript package for types and scoring logic
- Docker multi-stage builds (frontend + backend)
- GitHub Actions CI pipeline (lint, typecheck, test, Docker build)
- Express backend with Helmet, CORS, rate limiting, Winston logging
- Privacy by design: no cookies, no tracking, no analytics, no accounts

#### Documentation
- Product Requirements Document (PRD)
- Technical architecture documentation
- Frontend specifications
- Scoring methodology breakdown
