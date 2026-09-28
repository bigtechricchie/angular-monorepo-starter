# Libraries

Reusable capabilities shared by applications live under `libs/`.

The repository follows:

> **Applications own composition. Libraries own capabilities.**

Applications may depend on libraries. Libraries must not depend on
applications.

## Libraries

### `@lib/api`

`libs/api` owns framework-neutral API contracts and runtime boundary logic.

It contains endpoint definitions, response contracts, runtime parsers, and
contract-specific errors.

It does not depend on Angular, browser APIs, application code, or RxJS.

See [`api/README.md`](api/README.md).

### `@lib/ui`

`libs/ui` owns reusable presentational Angular components.

Components receive presentation state through inputs and communicate user
intent through outputs.

They do not own HTTP requests, routing, application state, or backend
communication.

See [`ui/README.md`](ui/README.md).

### Shared styles

`libs/styles` owns the static CSS foundation shared by applications.

It currently contains:

- design tokens
- browser normalization
- base document styles
- shared application-shell layout

Component-specific CSS remains with components, and application-specific
global CSS remains with applications.

See [`styles/README.md`](styles/README.md).

## Dependency direction

```text
applications
├── @lib/api
├── @lib/ui
└── libs/styles
```

Libraries must never import from an application.

Different capabilities use different tooling:

```text
libs/api
→ TypeScript
→ plain Vitest
→ Node environment

libs/ui
→ Angular
→ Angular unit-test builder
→ Vitest + DOM environment

libs/styles
→ static CSS
→ no runtime dependency
```

Use the lightest tooling that correctly supports each capability.

## TypeScript

Shared TypeScript library defaults live in:

```text
libs/tsconfig.json
```

Individual TypeScript libraries extend that configuration when their
environment requirements differ.

```text
libs/api
→ ES2022 only
→ no DOM APIs

libs/ui
→ ES2022 + DOM
→ browser presentation is intentional
```

`libs/styles` is CSS-only and does not participate in the TypeScript
configuration.

## Testing

Run API library tests:

```text
pnpm run test:api-lib
```

Run Angular UI library tests:

```text
pnpm run test:ui-lib --watch=false
```

Run all TypeScript and Angular library tests:

```text
pnpm run test:libs
```

`libs/styles` has no independent test target. Changes to shared styles cause
both Angular application suites to run through the pre-push gate.

## Public APIs

Applications import TypeScript libraries through their public aliases:

```ts
import { healthEndpoint } from '@lib/api';
import { HealthCheckStatus } from '@lib/ui';
```

Do not deep-import implementation files from another TypeScript library.

Each TypeScript library exposes its supported surface through
`src/public-api.ts`.

Shared CSS is loaded through:

```text
libs/styles/index.css
```

Applications should not import individual shared style files directly.

## Principles

- Keep libraries independent from applications.
- Keep public APIs small.
- Prefer source-only internal libraries.
- Do not add packaging or publishing infrastructure without a concrete need.
- Keep framework-neutral libraries framework-neutral.
- Keep application orchestration inside applications.
- Keep shared CSS static and dependency-light.
- Add abstractions only after reuse or a clear boundary has been demonstrated.
