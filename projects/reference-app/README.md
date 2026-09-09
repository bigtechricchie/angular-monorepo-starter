# Reference App

`projects/reference-app` is the permanent executable architecture guide and UI styleguide for the monorepo starter.

It demonstrates the canonical way Angular applications in this repository should compose shared capabilities while keeping application-specific concerns inside the application boundary.

## Purpose

The reference application exists to demonstrate patterns such as:

* application routing and composition;
* page and container structure;
* shared UI usage;
* design tokens and styling conventions;
* application-owned translations;
* state management with Angular signals;
* API integration;
* loading, empty, and error states;
* accessibility and responsive behavior.

These capabilities are introduced incrementally as the starter evolves.

## Architectural boundary

The reference application is a first-class application, but it is not a shared library.

Other applications must not import from `reference-app`.

When implementation becomes genuinely reusable across applications, it should be extracted into an appropriate library under `libs/`.

> **Applications own composition. Libraries own capabilities.**

## Development

Run the application from the repository root:

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

## Scope

The reference application should remain intentionally focused.

It should demonstrate real architectural and UI patterns without accumulating artificial product complexity solely for demonstration purposes.

