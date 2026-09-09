# Angular Monorepo Starter

A security-conscious Angular and Go monorepo starter designed for fast prototyping and clear application boundaries.

The project is built incrementally, with small architectural decisions that keep the starter easy to understand, adapt, and extend.

Built by Edward Siwek.

## Architecture

The repository follows one primary composition rule:

> **Applications own composition. Libraries own capabilities.**

Applications own product-specific concerns such as routing, pages, configuration, state, translations, and business behavior.

Shared libraries provide reusable frontend capabilities without depending on applications.

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
└── reference-app/    Permanent executable architecture guide and UI styleguide

services/
└── api/              Generic Go HTTP API

tools/                Repository tooling and Git hooks
```

Additional applications, libraries, and services are introduced only when a concrete requirement justifies them.

Repository-specific documentation:

- [`projects/reference-app/README.md`](projects/reference-app/README.md) - reference application purpose, architectural boundaries, and development.
- [`services/api/README.md`](services/api/README.md) - API setup, health endpoint, tests, and development checks.
- [`tools/README.md`](tools/README.md) - repository tooling, native Git hooks, and hook installation.

## Reference application

`reference-app` is the first Angular application and a permanent part of the starter.

It acts as an executable architecture guide and UI styleguide that demonstrates the canonical composition patterns of the monorepo.

Product applications should follow its patterns but must not depend on or import from `reference-app`.

When implementation becomes genuinely reusable across applications, it should be extracted into an appropriate shared library.

## Development

Install dependencies:

```bash
pnpm install
```

Run the reference application:

```bash
pnpm run dev:reference-app
```

Build it:

```bash
pnpm run build:reference-app
```

Run its tests:

```bash
pnpm run test:reference-app
```

The generic Go API is documented separately in `services/api/README.md`.

## License

MIT

