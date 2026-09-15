## Adding an Angular application

Generate new Angular applications from the repository root using the current Angular CLI.

Do not copy an existing application directory and rename it. Generate from the framework baseline, inspect the output, and deliberately adapt it to the repository conventions.

Use the established application baseline:

```bash
pnpm exec ng generate application <app-name> \
  --project-root projects/<app-name> \
  --routing \
  --standalone \
  --zoneless \
  --style css \
  --test-runner vitest \
  --strict \
  --prefix app-<name> \
  --skip-install \
  --defaults
```

For example:

```bash
pnpm exec ng generate application portal-app \
  --project-root projects/portal-app \
  --routing \
  --standalone \
  --zoneless \
  --style css \
  --test-runner vitest \
  --strict \
  --prefix app-portal \
  --skip-install \
  --defaults
```

After generation:

1. Inspect every generated file before adopting it.
2. Remove Angular demonstration content that does not belong to the application.
3. Remove generated assets and their `angular.json` configuration when they are unused.
4. Remove generated component stylesheets when they are unused and no repository rule requires them.
5. Keep external HTML templates.
6. Use plain, modern native CSS only. Do not introduce Sass, Less, CSS-in-JS, or a styling runtime.
7. Keep the application zoneless.
8. Do not copy application-specific features, pages, services, styles, or configuration from another application.
9. Add explicit root scripts using the established naming convention:

```text
dev:<app-name>
build:<app-name>
test:<app-name>
```

For example:

```json
{
  "scripts": {
    "dev:portal-app": "ng serve portal-app",
    "build:portal-app": "ng build portal-app",
    "test:portal-app": "ng test portal-app"
  }
}
```

10. Install and verify the generated application:

```bash
pnpm install
pnpm exec ng test <app-name> --watch=false
pnpm exec ng build <app-name>
git diff --check
```

Applications own their composition, including:

```text
routing
pages
configuration
state
translations
metadata
application-specific styling
```

Applications must not depend on other applications:

```text
Application → Application
✗ forbidden
```

If two or more applications prove they need the same technical capability, extract that capability into an appropriately named library:

```text
Repeated application need
→ identify the shared responsibility
→ extract to libs/<responsibility>
```

Do not create shared libraries in anticipation of future reuse.

The `reference-app` is the canonical executable architecture guide for the repository. Use it to understand the expected patterns and boundaries, but do not use it as a directory template to copy.
