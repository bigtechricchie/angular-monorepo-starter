# Portal App

Angular application for the portal experience.

## What this is

`portal-app` is the user-facing portal application.

It follows the same architectural and composition principles demonstrated in `reference-app`, while remaining a real, evolving product application rather than a styleguide.

## Development

Run the API:

```text
cd services/api
go run .
```

Run the Portal application:

```text
pnpm run dev:portal-app
```

The application is available at:

```text
http://localhost:4201
```

The Angular development server proxies `/api/**` requests to the Go API at `http://localhost:4000`.

## Testing

Run all tests for the Portal application:

```text
pnpm run test:portal-app -- --watch=false
```

Run a specific test file:

```text
pnpm exec ng test portal-app --include projects/portal-app/src/app/pages/not-found/not-found.spec.ts --watch=false
```

Run tests for a feature directory:

```text
pnpm exec ng test portal-app --include projects/portal-app/src/app/pages/not-found --watch=false
```

Vitest is provided through Angular's test tooling, so individual spec files do not need their own Vitest configuration or explicit test-runner setup.

## Build

Create a production build:

```text
pnpm run build:portal-app
```

## Routes

```text
/         → Home
/health   → Health check
```

Unknown routes are handled by the Not Found page.

The health check calls:

```text
GET /api/health
```
