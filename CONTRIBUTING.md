# Contributing to StackOverkill.io

Thanks for your interest in contributing! StackOverkill.io is a personal project, but contributions are welcome.

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (optional, for production builds)

### Setup

```bash
# Clone the repo
git clone https://github.com/Rwx-G/StackOverkill.io.git
cd StackOverkill.io

# Install dependencies
pnpm install

# Build the shared package
pnpm --filter @stackoverkill/shared build

# Start development servers
pnpm dev
```

This starts:
- **Frontend** (Next.js): http://localhost:3000
- **Backend** (Express): http://localhost:3001

## How to Contribute

### Reporting Bugs

Open an [issue](https://github.com/Rwx-G/StackOverkill.io/issues) with:
- A clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS information if relevant

### Suggesting Features

Open an [issue](https://github.com/Rwx-G/StackOverkill.io/issues) with the `enhancement` label. Describe:
- The problem you're trying to solve
- Your proposed solution
- Any alternatives you've considered

### Submitting Changes

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Make your changes
4. Run checks:
   ```bash
   pnpm lint
   pnpm test
   pnpm --filter @stackoverkill/shared build
   pnpm --filter @stackoverkill/frontend exec tsc --noEmit
   pnpm --filter @stackoverkill/backend exec tsc --noEmit
   ```
5. Commit with a descriptive message (see below)
6. Push and open a Pull Request

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new quiz question about backup strategy
fix: correct score calculation for hybrid hosting
docs: update API endpoint documentation
style: fix button alignment on mobile
refactor: extract scoring logic into shared package
test: add unit tests for verdict calculation
```

## Project Structure

```
StackOverkill/
├── apps/
│   ├── frontend/     # Next.js app (UI, quiz, results)
│   └── backend/      # Express API (scoring, leaderboard, OG images)
├── packages/
│   └── shared/       # Shared TypeScript types & scoring logic
├── docker/           # Dockerfiles for production builds
├── deploy/           # Deployment scripts
└── docs/             # Project documentation
```

## Code Style

- **TypeScript** everywhere
- **Prettier** for formatting (config in `.prettierrc`)
- **ESLint** for linting (config in `.eslintrc.js`)
- Run `pnpm format` to auto-format before committing

## Internationalization (i18n)

The app supports 5 languages: EN, FR, DE, IT, ES. Translation files are in `apps/frontend/messages/`.

When adding user-facing text:
1. Add the key to all 5 language files
2. Use the `useTranslations` hook: `const { t } = useTranslations()`

## License

By contributing, you agree that your contributions will be licensed under the project's [Source Available License](LICENSE). See the license file for details.

## Questions?

Open an issue or reach out at contact@rwx-g.fr.
