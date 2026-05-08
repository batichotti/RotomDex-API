# Contributing to RotomDex

> *"Thank you for taking the time to contribute — every little bit helps! This project is entirely open-source and unmonetized. Community contributions are what keep it alive!"*

Welcome, Trainer! 🎉 Whether you're fixing a bug, proposing a new feature, improving documentation, or just asking questions, your contribution matters. This guide covers everything you need to participate in both the **RotomDex** (frontend) and **RotomDex-API** (backend) repositories.

Before contributing, please read our [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you agree to uphold it.

---

## Table of Contents

- [The RotomDex Ecosystem](#the-rotomdex-ecosystem)
- [Community & Communication](#community--communication)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Your First Code Contribution](#your-first-code-contribution)
  - [Pull Requests](#pull-requests)
- [Development Setup](#development-setup)
  - [RotomDex (Frontend — Next.js)](#rotomdex-frontend--nextjs)
  - [RotomDex-API (Backend — NestJS)](#rotomdex-api-backend--nestjs)
- [Branch Strategy](#branch-strategy)
- [Commit Convention](#commit-convention)
- [Code Style](#code-style)
- [License](#license)

---

## The RotomDex Ecosystem

RotomDex is split into two repositories that work together:

| Repository | Stack | Purpose |
|------------|-------|---------|
| [RotomDex](https://github.com/batichotti/RotomDex) | Next.js · TypeScript · CSS | Modern Pokédex web interface — performance, responsiveness, and clean UI |
| [RotomDex-API](https://github.com/batichotti/RotomDex-API) | NestJS · TypeScript · Docker | RESTful API — modular architecture serving type-safe Pokémon data endpoints |

Make sure you're opening issues and pull requests in the **correct repository** for the change you're making.

---

## Community & Communication

Have a question? Want to discuss a feature before opening an issue? Join our Discord server:

> **💬 [discord.gg/VHnscgvMg](https://discord.gg/VHnscgvMg)**

This is the best place to get quick feedback, coordinate work with other contributors, and stay up to date with the project.

---

## How Can I Contribute?

### Reporting Bugs

Found something that's not working? Great catch!

Before opening a bug report:
- Search the [open issues](https://github.com/batichotti/RotomDex/issues) (and the [API issues](https://github.com/batichotti/RotomDex-API/issues)) to avoid duplicates.
- Make sure you're running the latest version of the project.

When opening a bug report, please include:
- **A clear and descriptive title**
- **Steps to reproduce** the problem (numbered list is ideal)
- **Expected behavior** — what should have happened
- **Actual behavior** — what actually happened
- **Screenshots or logs** if applicable
- **Environment info** — OS, Node.js version, browser (for frontend issues)

### Suggesting Features

Have an idea to make RotomDex better? We'd love to hear it!

Before opening a feature request:
- Check the [open issues](https://github.com/batichotti/RotomDex/issues) to see if someone already suggested it.
- Think about whether your idea fits the project's scope and goals.

When opening a feature request, please include:
- **A clear and descriptive title**
- **The problem your feature solves** — e.g., *"As a user, I can't filter Pokémon by generation..."*
- **Your proposed solution** — describe the behavior you'd like
- **Alternatives considered** — any other approaches you thought of
- **Mockups or examples** if the feature is visual (for the frontend)

### Your First Code Contribution

Not sure where to start? Look for issues labeled:

- `good first issue` — simple, self-contained tasks great for newcomers
- `help wanted` — issues where maintainers would especially appreciate contributions
- `bug` — confirmed bugs ready to be fixed

Feel free to comment on an issue to ask questions or let others know you're working on it.

### Pull Requests

1. **Fork** the repository and create your branch from `main` (see [Branch Strategy](#branch-strategy)).
2. **Set up the project** locally (see [Development Setup](#development-setup)).
3. **Make your changes**, following the [Code Style](#code-style) guidelines.
4. **Write or update tests** if applicable.
5. **Ensure the build passes** and there are no linting errors.
6. **Commit** your changes following the [Commit Convention](#commit-convention).
7. **Push** your branch and open a Pull Request against `main`.
8. Fill in the PR template completely — describe *what* you changed and *why*.
9. **Wait for review.** A maintainer will review your PR as soon as possible. Be ready to address feedback.

> **Tip:** For significant changes, open an issue first so we can discuss the approach before you invest time coding.

---

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) (required for RotomDex-API)

---

### RotomDex (Frontend — Next.js)

```bash
# 1. Fork and clone the repository
git clone https://github.com/<your-username>/RotomDex.git
cd RotomDex/rotomdex

# 2. Install dependencies
npm install

# 3. Copy the environment variables file and configure it
cp .env.example .env.local
# Edit .env.local with the appropriate values

# 4. Start the development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

**Useful scripts:**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build locally |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run the TypeScript compiler check |

---

### RotomDex-API (Backend — NestJS)

```bash
# 1. Fork and clone the repository
git clone https://github.com/<your-username>/RotomDex-API.git
cd RotomDex-API/rotomdex-api

# 2. Install dependencies
npm install

# 3. Copy the environment variables file and configure it
cp .env.example .env
# Edit .env with the appropriate values (database credentials, ports, etc.)

# 4. Start the services with Docker Compose
docker compose up -d

# 5. Start the development server
npm run start:dev
```

The API will be available at [http://localhost:3001](http://localhost:3001) (or the port configured in `.env`).

**Useful scripts:**

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start NestJS in watch mode |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run start:prod` | Run the compiled production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |

---

## Branch Strategy

We follow a simple branching model:

| Branch | Purpose |
|--------|---------|
| `main` | Stable, production-ready code. Never commit directly here. |
| `feat/<short-description>` | New features (e.g., `feat/pokemon-search-filter`) |
| `fix/<short-description>` | Bug fixes (e.g., `fix/type-badge-color`) |
| `docs/<short-description>` | Documentation changes (e.g., `docs/update-readme`) |
| `refactor/<short-description>` | Code refactoring without behavior changes |
| `chore/<short-description>` | Maintenance tasks — dependency updates, build config, etc. |

Always branch off from `main` and target `main` in your pull request.

---

## Commit Convention

We use **[Conventional Commits](https://www.conventionalcommits.org/)** to keep the git history readable and to enable automated changelogs.

**Format:** `<type>(<scope>): <short summary>`

**Types:**

| Type | When to use |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `style` | Formatting, missing semicolons — no logic change |
| `refactor` | Code change that is neither a fix nor a feature |
| `perf` | A performance improvement |
| `test` | Adding or correcting tests |
| `chore` | Build process, dependency updates, tooling |

**Examples:**

```
feat(search): add filter by Pokémon type
fix(card): correct sprite URL for generation-2 Pokémon
docs(contributing): add Docker setup instructions
refactor(api): extract Pokémon service into separate module
chore(deps): update NestJS to v11
```

- Use the **imperative present tense** in the summary: *"add filter"* not *"added filter"*
- Keep the summary under **72 characters**
- Optionally add a body and/or footer for more context

---

## Code Style

### General

- All code is written in **TypeScript** — avoid `any` whenever possible.
- Keep functions focused and small — single responsibility.
- Write self-documenting code; add comments only when the *why* isn't obvious.
- Remove unused imports, variables, and dead code before opening a PR.

### Frontend (RotomDex — Next.js)

- Follow the existing project structure under `src/`.
- Components go in `src/components/`, pages in `src/app/` (App Router).
- Use **CSS Modules** or the existing styling approach — do not introduce new CSS frameworks without discussion.
- Prefer **React Server Components** where possible.
- All props must be typed with explicit TypeScript interfaces or types.
- Run `npm run lint` and resolve all warnings before pushing.

### Backend (RotomDex-API — NestJS)

- Follow the **NestJS modular architecture** — each feature has its own module folder.
- Use **DTOs** with class-validator for input validation.
- Expose responses through **typed interfaces or classes** — no `any` in responses.
- Decorate endpoints with appropriate **Swagger/OpenAPI** decorators.
- New database interactions must go through the **service layer** — not directly in controllers.
- Run `npm run lint` and `npm run test` before pushing.

---

## License

By contributing to RotomDex or RotomDex-API, you agree that your contributions will be licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**, the same license that covers the project.

See the [LICENSE](./LICENSE) file for details.

---

*Thanks again for being part of the RotomDex journey. Your contributions — big or small — make this Pokédex better for everyone. Now go catch 'em all! 🔴📖*