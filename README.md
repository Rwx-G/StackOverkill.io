<p align="center">
  <h1 align="center">StackOverkill.io</h1>
  <p align="center">Is your infrastructure OVERKILL? Find out in 2 minutes if your tech stack matches your actual needs.</p>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-Source%20Available-blue.svg" alt="License"></a>
  <img src="https://img.shields.io/badge/Next.js-16-black.svg" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5.3-blue.svg" alt="TypeScript">
  <img src="https://img.shields.io/badge/Node.js-20-green.svg" alt="Node.js">
  <img src="https://img.shields.io/badge/Platform-Web-0078D6.svg" alt="Platform">
  <img src="https://img.shields.io/badge/Status-v1.0.0-brightgreen.svg" alt="Status">
  <a href="https://github.com/Rwx-G/StackOverkill.io/actions"><img src="https://img.shields.io/badge/CI-GitHub%20Actions-2088FF.svg" alt="CI"></a>
  <a href="https://stackoverkill.io"><img src="https://img.shields.io/badge/demo-stackoverkill.io-purple.svg" alt="Demo"></a>
</p>

**[Try it live at stackoverkill.io](https://stackoverkill.io)**

## What is StackOverkill?

StackOverkill.io is a free, fun diagnostic tool that measures the gap between your IT infrastructure complexity and your actual business needs. Answer 14 quick questions and get an instant verdict — then share it with your team.

### 7 Verdict Levels

| Verdict | Meaning |
|---------|---------|
| **Overkill Severe** | Way too much infra for what you're doing |
| **Overkill** | Infrastructure is overengineered |
| **Slight Overkill** | Minor over-engineering detected |
| **Balanced** | Perfect match between needs and stack |
| **Slight Underkill** | Could use a bit more structure |
| **Underkill** | Infrastructure is insufficient |
| **Underkill Severe** | Critical infrastructure gaps |

### Features

- **14-question quiz** — 7 about your app, 7 about your infrastructure
- **Instant visual verdict** with shareable result cards and OG images
- **LinkedIn sharing** — one-click share with pre-generated preview
- **Global leaderboard** — opt-in, see the most extreme stacks worldwide
- **5 languages** — English, French, German, Italian, Spanish
- **Roast mode** — a brutally honest easter egg for the brave
- **Privacy-first** — no cookies, no tracking, no analytics, no accounts
- **Fully responsive** — optimized for mobile, tablet and desktop
- **Dark mode UI** — sleek design with animations and transitions

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React, TypeScript, Tailwind CSS, Zustand |
| Backend | Express, TypeScript, Satori (OG images), Sharp |
| Build | Turborepo, pnpm workspaces |
| Deploy | Docker, GitHub Actions, GHCR |

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+

### Development

```bash
# Clone the repo
git clone https://github.com/Rwx-G/StackOverkill.io.git
cd StackOverkill.io

# Install dependencies
pnpm install

# Build shared package
pnpm --filter @stackoverkill/shared build

# Start dev servers (frontend :3000, backend :3001)
pnpm dev
```

### Production (Docker)

```bash
# Build images
docker build -f docker/frontend.Dockerfile -t stackoverkill-frontend .
docker build -f docker/backend.Dockerfile -t stackoverkill-backend .

# Run with Docker Compose
docker compose -f docker-compose.prod.yml up -d
```

## Project Structure

```
StackOverkill/
├── apps/
│   ├── frontend/          # Next.js application
│   └── backend/           # Express API server
├── packages/
│   └── shared/            # Shared types & scoring logic
├── docker/                # Dockerfiles
├── deploy/                # Deployment scripts
├── docs/                  # Documentation (PRD, architecture, specs)
└── data/                  # Leaderboard data (volume-mounted)
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |
| POST | `/api/v1/score/calculate` | Calculate score from quiz inputs |
| GET | `/api/v1/leaderboard` | Get top leaderboard entries |
| POST | `/api/v1/leaderboard` | Submit to leaderboard (opt-in) |
| GET | `/api/v1/og/badge` | Generate OG image badge |

## Environment Variables

See [`.env.example`](.env.example) for all available configuration options.

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under a [Source Available License](LICENSE). You can view, study, and contribute to the code, but commercial use and public hosting require written permission.

## Screenshots

> _Coming soon — contributions welcome!_

## Author

Made with fun by [Rwx-G](https://www.rwx-g.fr) — a personal project to help IT professionals question their tech stack choices.

**Website:** [www.rwx-g.fr](https://www.rwx-g.fr) | **Project:** [stackoverkill.io](https://stackoverkill.io)
