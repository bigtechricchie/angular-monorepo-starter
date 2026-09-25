# Angular Monorepo Starter

A security-focused Angular and Go monorepo starter designed for fast prototyping and clear application boundaries.

The project is built incrementally, with small architectural decisions that keep the starter easy to understand, adapt, and extend.

Built by Edward Siwek.

## Architecture

The repository follows one primary composition rule:

> **Applications own composition. Libraries own capabilities.**

Applications own product-specific concerns such as routing, pages, configuration, state, translations, and business behavior.

When reusable frontend capabilities are proven, they can be extracted into shared libraries without introducing dependencies between applications.

Backend services are independently executable and do not need to mirror frontend application boundaries.

## Engineering principles

* Keep dependencies minimal and justify every addition.
* Introduce abstractions only after a real need is proven.
* Keep commits small, atomic, and reviewable.
* Prefer explicit ownership, clear boundaries, and descriptive names.
* Treat security and simplicity as complementary engineering goals.
* Inspect generated framework output before adopting or modifying it.
* Keep generated artifacts out of source control.
* Pin tool and direct dependency versions exactly.

The repository is constructed incrementally, one coherent commit at a time, so its Git history explains how the architecture evolves and why each piece exists.

## Repository structure

```text
projects/
├── reference-app/    Permanent executable architecture guide and UI styleguide
└── portal-app/       User-facing portal application

libs/
└── api/              Shared framework-neutral frontend API contracts and parsers

services/
└── api/              Generic Go HTTP API

tools/                Repository tooling and Git hooks
```

Additional applications, libraries, and services are introduced only when a concrete requirement justifies them.

`libs/api` contains framework-neutral TypeScript contracts, endpoint definitions, and runtime parsers used by frontend applications.

`services/api` is the independently executable Go HTTP API.

Repository-specific documentation:

* [`projects/reference-app/README.md`](projects/reference-app/README.md) - reference application purpose, architectural boundaries, and development.
* [`projects/portal-app/README.md`](projects/portal-app/README.md) - portal application development, testing, routes, and API integration.
* [`services/api/README.md`](services/api/README.md) - API setup, health endpoint, tests, and development checks.
* [`tools/README.md`](tools/README.md) - repository tooling, native Git hooks, and hook installation.
* [`docs/security-decisions.md`](docs/security-decisions.md) - security-oriented design decisions, trust boundaries, and deliberate tooling choices.
* [`docs/solving-dependency-vulnerabilities.md`](docs/solving-dependency-vulnerabilities.md) - investigation and remediation workflow for dependency security advisories.

## Applications

### Reference App

`reference-app` is the first Angular application and a permanent part of the starter.

It acts as an executable architecture guide and UI styleguide that demonstrates the canonical composition patterns of the monorepo.

Product applications should follow its patterns but must not depend on or import from `reference-app`.

### Portal App

`portal-app` is the user-facing portal application.

It follows the architectural and composition principles demonstrated in `reference-app` while remaining an independently evolving application.

Applications must not depend on one another.

When implementation becomes genuinely reusable across applications, it can be extracted into an appropriate shared capability.

## Development

Install dependencies:

```text
pnpm install
```

Run the reference application:

```text
pnpm run dev:reference-app
```

Run the Portal application:

```text
pnpm run dev:portal-app
```

Build the reference application:

```text
pnpm run build:reference-app
```

Build the Portal application:

```text
pnpm run build:portal-app
```

Type-check the shared libraries:

```text
pnpm run typecheck:libs
```

Run the shared library tests:

```text
pnpm run test:libs
```

Run the reference application tests:

```text
pnpm run test:reference-app -- --watch=false
```

Run the Portal application tests:

```text
pnpm run test:portal-app -- --watch=false
```

The generic Go API is documented separately in [`services/api/README.md`](services/api/README.md).

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the approved workflow for generating Angular applications and introducing pages or shared capabilities.

## License

MIT
