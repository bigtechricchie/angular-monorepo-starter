# Portal App

Angular application for the portal experience.

## Development

Run the API:

```bash
cd services/api
go run .
```

Run the Portal application:

```bash
pnpm run dev:portal-app
```

The application is available at:

```text
http://localhost:4201
```

The Angular development server proxies `/api/**` requests to the Go API at `http://localhost:4000`.

## Routes

```text
/health
```

Provides a simple API health check against:

```text
GET /api/health
```
