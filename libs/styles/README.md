# Shared Styles

Shared visual foundations used by the Angular applications.

`libs/styles` is CSS-only. It contains no Angular code, TypeScript, runtime
styling library, or package build.

## Responsibilities

`libs/styles` owns styling that is genuinely shared across applications.

It currently owns:

- design tokens
- browser normalization
- global document styles
- shared application-shell layout

Component-specific styles stay with their component.

Application-specific global styles stay with their application.

## Loading

Applications load the shared stylesheet through `angular.json` before their
own application stylesheet:

```text
libs/styles/index.css
→ projects/<app>/src/styles.css
```

`index.css` owns the internal load order:

```text
tokens
→ reset
→ base
→ layout
```

Applications should not import the individual shared files directly.

## Design tokens

`tokens.css` contains only values that are currently needed by the shared
visual foundation.

Selected custom properties are registered with `@property` when a useful
CSS value type can be enforced.

For example, colour tokens accept colours and spacing tokens accept lengths.

Property registration improves token correctness, inheritance behaviour,
and fallback predictability. It is defense in depth and is not a substitute
for preventing untrusted values from becoming arbitrary CSS.

Do not create a large token catalogue speculatively. Add tokens when a
shared design value is demonstrated.

## Security and dependency rules

The styling layer uses static native CSS.

- No CSS-in-JS.
- No runtime-generated styles.
- No styling framework.
- No external stylesheet CDN.
- No external font service.
- Use system fonts.
- Do not construct arbitrary CSS from untrusted input.
- Do not add a styling dependency without a concrete requirement.
- Keep long or variable content contained by its layout where appropriate.
- Keep flex and grid children shrinkable where content could otherwise
  escape its intended area.

Static, dependency-light styling reduces runtime complexity and
supply-chain surface area and makes Content Security Policy reasoning
simpler.

## Ownership

```text
libs/styles
→ shared visual foundation

libs/ui
→ shared component-specific styles

projects/<app>
→ application-specific global styles
```

For example, `HealthCheckStatus` keeps its CSS in `libs/ui`.

Application root-host selectors remain in each application's `styles.css`
because those selectors belong to that application.

## Structure

```text
libs/styles/
├── README.md
├── index.css
├── tokens.css
├── reset.css
├── base.css
└── layout.css
```

## Rules

- Keep this capability CSS-only.
- Prefer native CSS.
- Keep the shared foundation small.
- Keep component styles with components.
- Keep application-specific styles inside applications.
- Register custom properties selectively where their type matters.
- Do not treat `@property` as an arbitrary CSS injection sanitizer.
- Preserve useful browser defaults unless there is a deliberate reason to
  reset them.
- Add abstractions only after reuse has been demonstrated.
