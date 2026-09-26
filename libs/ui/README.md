# @lib/ui

Shared presentational Angular components.

The library is consumed directly from source through the `@lib/ui` path
alias. It is not packaged or published.

## Responsibilities

`@lib/ui` owns reusable presentation.

Components may own:

- markup
- component-specific layout
- component-specific styles
- input contracts
- output events
- small presentational logic

They must not own:

- backend calls
- HTTP resources
- application services
- application state
- routing
- application-specific behavior

The application owns orchestration. Shared UI components receive
presentation-ready values and emit user intent.

## HealthCheckStatus

`HealthCheckStatus` presents the state of an API health check.

It receives:

```text
isLoading
status
errorMessage
description
actionLabel
loadingLabel
statusLabel
```

and emits:

```text
checkRequested
```

The component does not know how the health request is performed.

The application owns `HealthApiService`, `httpResource()`, API parsing, and
request lifecycle.

The routed page also keeps ownership of its page heading and surrounding
composition.

## Testing

Angular UI specs run through the Angular unit-test builder:

```text
pnpm run test:ui-lib --watch=false
```

The Angular workspace project is named:

```text
ui-lib
```

`ui-lib` exists for Angular-aware test tooling only.

Because this source-only library has no packaging build target, its test
target uses:

```text
reference-app:build:development
```

as the Angular test host.

This is a tooling dependency only. `@lib/ui` does not import from
`reference-app`.

If `reference-app` is renamed or removed, update the `ui-lib` `buildTarget`
in `angular.json`.

Vitest APIs are imported explicitly.

## TypeScript

`libs/ui/tsconfig.json` extends the shared library configuration and enables
DOM types because browser presentation is an intended capability.

`libs/ui/tsconfig.spec.json` defines the Angular test TypeScript program.

## Styling

Component-specific CSS stays beside the component.

For example:

```text
src/health-check-status/health-check-status.css
```

Shared styling foundations should only move into a future `libs/styles`
capability once real reuse is demonstrated.

## Structure

```text
libs/ui/
├── README.md
├── tsconfig.json
├── tsconfig.spec.json
└── src/
    ├── public-api.ts
    └── health-check-status/
        ├── health-check-status.ts
        ├── health-check-status.html
        ├── health-check-status.css
        └── health-check-status.spec.ts
```

## Rules

- Keep shared UI presentational.
- Keep application orchestration inside applications.
- Do not call the backend.
- Do not own HTTP resources.
- Do not inject application services.
- Do not import from applications.
- Prefer presentation-ready inputs over API transport objects.
- Use outputs to communicate user intent.
- Keep component-specific CSS beside the component.
- Keep the public API small.
