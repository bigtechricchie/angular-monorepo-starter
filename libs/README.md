# Libraries

Reusable capabilities shared by applications live under `libs/`.

The repository follows:

> **Applications own composition. Libraries own capabilities.**

Applications may depend on libraries. Libraries must not depend on
applications.

## Libraries

### `@lib/api`

`libs/api` owns framework-neutral API contracts and runtime boundary logic.

It contains:

- endpoint definitions
- response contracts
- runtime parsers
- contract-specific errors

It does not depend on Angular, browser APIs, application code, or RxJS.

See [`api/README.md`](api/README.md).

### `@lib/ui`

`libs/ui` owns reusable presentational Angular components.

Components receive presentation state through inputs and communicate user
intent through outputs.

They do not own HTTP requests, routing, application state, or backend
communication.

See [`ui/README.md`](ui/README.md).

## Dependency direction

```text
applications
├── @lib/api
└── @lib/ui
```

Libraries must never import from an application.

Libraries may have different tooling depending on their capability.

```text
libs/api
→ TypeScript
→ plain Vitest
→ Node environment

libs/ui
→ Angular
→ Angular unit-test builder
→ Vitest + DOM environment
```

Use the lightest tooling that correctly supports each library.

## TypeScript

Shared library TypeScript defaults live in:

```text
libs/tsconfig.json
```

Individual libraries extend that configuration when they need stronger
environment boundaries.

For example:

```text
libs/api
→ ES2022 only
→ no DOM APIs

libs/ui
→ ES2022 + DOM
→ browser presentation is intentional
```

## Testing

Run API library tests:

```text
pnpm run test:api-lib
```

Run Angular UI library tests:

```text
pnpm run test:ui-lib --watch=false
```

Run all library tests:

```text
pnpm run test:libs
```

## Public APIs

Applications should import libraries through their public aliases:

```ts
import { healthEndpoint } from '@lib/api';
import { HealthCheckStatus } from '@lib/ui';
```

Do not deep-import implementation files from another library.

Each library exposes its supported surface through:

```text
src/public-api.ts
```

## Principles

- Keep libraries independent from applications.
- Keep public APIs small.
- Prefer source-only internal libraries.
- Do not add packaging or publishing infrastructure without a concrete need.
- Keep framework-neutral libraries framework-neutral.
- Keep application orchestration inside applications.
- Add abstractions only after reuse or a clear boundary has been demonstrated.
