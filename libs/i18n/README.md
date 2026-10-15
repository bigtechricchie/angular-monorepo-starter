# I18n

Shared translation contracts and reusable translated content.

The first version of `@lib/i18n` deliberately focuses on centralizing
user-facing text. It does not yet provide runtime locale switching.

## Responsibilities

`@lib/i18n` currently owns:

- translation contracts that are genuinely shared by applications
- translated content that is genuinely shared by applications
- the public API for those shared translation capabilities

Applications continue to own application-specific translated content.

## Current language

The starter currently provides English content only.

This is intentional.

The first step is to establish clear ownership and centralize user-facing
text before introducing runtime localization infrastructure.

## Shared and application-owned content

Shared wording belongs in:

```text
libs/i18n/src/translations/
```

Application-specific wording belongs in:

```text
projects/<app>/src/translations/
```

For example:

```text
@lib/i18n
→ Home
→ Health
→ shared health-check labels

reference-app
→ Reference App
→ reference-specific page text

portal-app
→ Portal App
→ portal-specific page text
```

Do not move text into the shared library merely because two strings happen
to have the same value.

The wording should represent the same shared concept.

## Translation schemas

`schema.ts` defines only translation sections that are shared capabilities.

Application-specific sections are defined by the application.

This prevents the shared i18n capability from learning about product-specific
pages or application structure.

Translation objects use TypeScript's `satisfies` operator so missing or
incorrect fields are detected during type checking while literal information
is preserved.

## Runtime localization

Runtime locale selection is deliberately deferred.

The library does not currently contain:

- a locale signal
- an Angular service
- an injection token
- a provider
- runtime language switching
- `deepFreeze`

Those capabilities should be introduced when a second locale creates the
requirement.

At that point the existing translation objects can become inputs to the
runtime localization mechanism without changing their ownership.

## Immutability

Translation constants use `as const` for compile-time readonly inference.

A runtime `deepFreeze` helper is not needed yet because translations are
static module-level constants.

If runtime translation maps are introduced later, `deepFreeze` may be used
as a developer-mistake guard against accidental mutation.

It must not be described as a security boundary.

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

## Rules

- Keep translated content centralized.
- Keep shared wording genuinely shared.
- Keep application-specific wording inside applications.
- Do not import application translations into this library.
- Do not introduce runtime localization until multiple locales require it.
- Do not add a third-party i18n dependency without a demonstrated need.
- Keep the library framework-neutral until Angular-specific runtime behaviour
  is required.
- Export supported functionality through `src/public-api.ts`.
