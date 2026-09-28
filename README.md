# Angular Monorepo Starter

A security-focused Angular and Go monorepo starter designed for fast prototyping and clear application boundaries.

The project is built incrementally, with small architectural decisions that keep the starter easy to understand, adapt, and extend.

Built by Edward Siwek.

## Architecture

The repository follows one primary composition rule:

> **Applications own composition. Libraries own capabilities.**

Applications own product-specific concerns such as routing, pages, configuration, state, translations, and business behavior.

Libraries own reusable capabilities that can be consumed by multiple applications without introducing application-to-application dependencies.

Backend services are independently executable and do not need to mirror frontend application boundaries.

## Engineering principles

- Keep dependencies minimal and justify every addition.
- Introduce abstractions only after a real need is proven.
- Keep commits small, atomic, and reviewable.
- Prefer explicit ownership, clear boundaries, and descriptive names.
- Treat security and simplicity as complementary engineering goals.
- Inspect generated framework output before adopting or modifying it.
- Keep generated artifacts out of source control.
- Pin tool and direct dependency versions exactly.
- Prefer static, native CSS over runtime styling dependencies.

The repository is constructed incrementally, one coherent commit at a time, so its Git history explains how the architecture evolves and why each piece exists.

## Repository structure

```text
projects/
├── reference-app/    Permanent executable architecture guide and UI styleguide
└── portal-app/       User-facing portal application

libs/
├── api/              Framework-neutral API contracts and runtime parsers
├── ui/               Shared presentational Angular components
└── styles/           Shared static CSS foundation

services/
└── api/              Generic Go HTTP API

tools/                 Repository tooling and native Git hooks
```

Additional applications, libraries, services, and abstractions are introduced only when a concrete requirement justifies them.

Repository-specific documentation:

- [`projects/reference-app/README.md`](projects/reference-app/README.md) - reference application purpose, architectural boundaries, and development.
- [`projects/portal-app/README.md`](projects/portal-app/README.md) - portal application development, testing, routes, and API integration.
- [`libs/README.md`](libs/README.md) - shared library architecture, dependency direction, and tooling principles.
- [`libs/api/README.md`](libs/api/README.md) - API contracts, runtime validation, and framework-neutral boundaries.
- [`libs/ui/README.md`](libs/ui/README.md) - shared Angular presentation and Angular-aware testing.
- [`libs/styles/README.md`](libs/styles/README.md) - shared design tokens, reset, document styles, shell layout, and CSS ownership rules.
- [`services/api/README.md`](services/api/README.md) - API setup, health endpoint, tests, and development checks.
- [`tools/README.md`](tools/README.md) - repository tooling, native Git hooks, and hook installation.
- [`docs/security-decisions.md`](docs/security-decisions.md) - security-oriented design decisions, trust boundaries, and deliberate tooling choices.
- [`docs/solving-dependency-vulnerabilities.md`](docs/solving-dependency-vulnerabilities.md) - dependency advisory investigation and remediation workflow.

## Applications

### Reference App

`reference-app` is a permanent part of the starter.

It acts as an executable architecture guide and UI styleguide that demonstrates the canonical composition patterns of the monorepo.

Product applications should follow its patterns but must not depend on or import from `reference-app`.

### Portal App

`portal-app` is the user-facing portal application.

It follows the architectural and composition principles demonstrated in `reference-app` while remaining an independently evolving application.

Applications must not depend on one another.

When implementation becomes genuinely reusable across applications, it can be extracted into an appropriate shared capability.

## Libraries

### API Library

`@lib/api` is a framework-neutral TypeScript library.

It owns reusable API boundaries such as:

- endpoint constants
- response contracts
- runtime parsers
- contract-specific errors

Network data is treated as untrusted until it passes runtime validation.

The library does not depend on Angular, browser APIs, RxJS, or application code.

### UI Library

`@lib/ui` contains shared presentational Angular components.

Applications pass presentation-ready state through inputs, and components communicate user intent through outputs.

The UI library does not own backend calls, HTTP resources, routing, or application state.

It is consumed directly from source and is not packaged or published.

### Shared Styles

`libs/styles` contains the shared static CSS foundation.

It owns:

- design tokens
- browser normalization
- base document styles
- shared application-shell layout

Component-specific CSS remains with components.

Application-specific global CSS remains with applications.

The styling layer uses native static CSS, system fonts, and no runtime styling framework or external font service.

Selected CSS custom properties are registered with `@property` when a useful value type can be constrained. Property registration is defense in depth for token correctness and predictability; it is not a substitute for preventing untrusted values from becoming arbitrary CSS.

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

## Build

Build the reference application:

```text
pnpm run build:reference-app
```

Build the Portal application:

```text
pnpm run build:portal-app
```

## Type checking

Type-check shared TypeScript libraries:

```text
pnpm run typecheck:libs
```

Framework-neutral and Angular-aware libraries use separate TypeScript configuration where their environment requirements differ.

## Testing

Run the reference application tests:

```text
pnpm run test:reference-app --watch=false
```

Run the Portal application tests:

```text
pnpm run test:portal-app --watch=false
```

Run the framework-neutral API library tests:

```text
pnpm run test:api-lib
```

Run the Angular UI library tests:

```text
pnpm run test:ui-lib --watch=false
```

Run all TypeScript and Angular library tests:

```text
pnpm run test:libs
```

The library test commands intentionally use different pipelines:

```text
api-lib
→ plain Vitest
→ Node environment

ui-lib
→ Angular unit-test builder
→ Vitest + DOM environment
```

`libs/styles` has no independent test target. Shared style changes are exercised through both Angular applications by the pre-push gate.

## API service

The generic Go API is documented separately in [`services/api/README.md`](services/api/README.md).

Frontend applications own request orchestration while reusable endpoint contracts and runtime parsers live in `@lib/api`.

## Repository tooling

Native Git hooks provide local security and quality gates without introducing a hook framework dependency.

Install the tracked hooks after cloning:

```text
bash tools/scripts/setup-hooks.sh
```

The pre-push gate runs a dependency security audit and selects relevant library and application tests based on the files being pushed.

Shared style changes exercise both Angular applications.

See [`tools/README.md`](tools/README.md) for details.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the approved workflow for generating Angular applications and introducing pages or shared capabilities.

## License

MIT
