# I18n

Shared translation contracts and reusable translated content.

The first version of `@lib/i18n` deliberately focuses on centralizing user-facing text. It does not yet provide runtime locale switching.

## Responsibilities

`@lib/i18n` currently owns:

- translation contracts that are genuinely shared by applications
- translated content that is genuinely shared by applications
- the public API for those shared translation capabilities

Applications continue to own application-specific translated content.

## Current language

The starter currently provides English content only.

This is intentional.

The first step is to establish clear ownership and centralize user-facing text before introducing runtime localization infrastructure.

## Shared and application-owned content

Shared translated content belongs in:

```text
libs/i18n/src/translations/
```

Application-specific translated content belongs in:

```text
projects/<app>/src/i18n/
```

For example:

```text
@lib/i18n
→ shared navigation labels
→ shared health-page wording
→ shared health-check labels

reference-app
→ Reference App
→ architecture-reference page content

portal-app
→ Portal App
→ portal-specific page content
```

Do not move text into the shared library merely because two strings happen to have the same value.

The wording should represent the same shared concept.

## Translation schemas

`schema.ts` defines only translation sections that belong to shared capabilities.

Application-specific sections are defined by each application.

For example:

```text
SharedTranslation
├── navigation
└── health

ReferenceTranslation
├── shared translation sections
├── app
└── home

PortalTranslation
├── shared translation sections
├── app
└── home
```

This prevents the shared i18n capability from learning about product-specific pages or application structure.

Translation objects use TypeScript's `satisfies` operator so missing or incorrectly typed fields are detected during type checking while literal information is preserved.

## Application integration

Applications extend the shared translation contract with their own application-specific sections.

Each application owns its translation entry point:

```text
projects/<app>/src/i18n/
├── en.ts
├── index.ts
└── schema.ts
```

Application translation objects compose the shared translation data with application-owned content.

For example:

```ts
export const PORTAL_TRANSLATION = {
  ...SHARED_TRANSLATION,
  app: {
    title: 'Portal App',
  },
  home: {
    title: 'Home',
    description: 'Application portal.',
    healthLink: 'Check API health status',
  },
} as const satisfies PortalTranslation;
```

Application components consume their application translation object rather than importing shared implementation files directly.

## Runtime localization

Runtime locale selection is deliberately deferred.

The library does not currently contain:

- a locale signal
- an Angular service
- an injection token
- a provider
- runtime language switching
- runtime translation loading
- `deepFreeze`

Those capabilities should be introduced when a second locale creates a concrete requirement.

At that point, the existing translation objects can become inputs to a runtime localization mechanism without changing their ownership boundaries.

## Immutability

Translation constants use `as const` for compile-time readonly inference.

A runtime `deepFreeze` helper is not needed because translations are currently static module-level constants.

If runtime translation maps are introduced later, `deepFreeze` may be considered as a developer-mistake guard against accidental mutation.

It must not be described as a security boundary.

## Validation and testing

`@lib/i18n` currently contains static data and compile-time contracts rather than runtime behavior.

For that reason, it does not have an independent runtime unit-test suite yet.

The library is validated through:

```text
TypeScript type checking
→ validates translation schemas and objects

application unit tests
→ validate translated content is rendered through application integration

application builds
→ validate Angular template consumption
```

The shared library is included in:

```text
pnpm run typecheck:libs
```

Changes to `libs/i18n` also trigger the relevant application validation through the repository's pre-push gate.

Static translation constants should not receive tests that merely repeat their literal values.

## Dependencies

`@lib/i18n` is framework-neutral.

It must not depend on:

- Angular
- RxJS
- browser APIs
- application code

It is consumed directly from source and is not packaged or published.

## Structure

```text
libs/i18n/
├── README.md
├── tsconfig.json
└── src/
    ├── public-api.ts
    ├── schema.ts
    └── translations/
        └── en.ts
```

Application-owned translation content follows:

```text
projects/<app>/src/i18n/
├── en.ts
├── index.ts
└── schema.ts
```

## Public API

Applications consume shared translation capabilities through:

```ts
import {
  SHARED_TRANSLATION,
  type SharedTranslation,
} from '@lib/i18n';
```

Consumers must not deep-import files from `libs/i18n/src/`.

Supported functionality is exported through:

```text
libs/i18n/src/public-api.ts
```

## Rules

- Keep translated content centralized.
- Keep shared wording genuinely shared.
- Keep application-specific wording inside applications.
- Keep application translation schemas owned by their applications.
- Do not import application translations into this library.
- Do not introduce runtime localization until multiple locales require it.
- Do not add a third-party i18n dependency without a demonstrated need.
- Keep the library framework-neutral until framework-specific runtime behavior is genuinely required.
- Do not add runtime machinery for requirements that exist only at compile time.
- Export supported functionality through `src/public-api.ts`.
