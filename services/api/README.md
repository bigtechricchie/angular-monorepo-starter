# API

`services/api` is the starter repository's Go HTTP API.

It provides the smallest useful backend starting point for local development and
future application features while keeping the initial implementation simple,
explicit, and standard-library first.

The service currently exposes:

```text
GET /health
```

which returns:

```json
{"status":"ok"}
```

## Requirements

Use the Go version selected by the repository:

```text
Go 1.27.1
```

Verify your local version with:

```bash
go version
```

## Run the API

From the repository root:

```bash
cd services/api
go run .
```

By default, the API listens on:

```text
http://localhost:4000
```

Override the port with the `PORT` environment variable:

```bash
PORT=5050 go run .
```

An invalid `PORT` value (non-numeric, or outside the `1–65535` range) causes
the service to log an error and exit rather than starting on an unexpected
port.

Verify the health endpoint:

```bash
curl -i http://localhost:4000/health
```

Expected response body:

```json
{"status":"ok"}
```

## Run the tests

From `services/api`:

```bash
go test ./...
```

For verbose test output:

```bash
go test -v ./...
```

## Development checks

Format the Go source:

```bash
gofmt -w .
```

Run Go's static checks:

```bash
go vet ./...
```

Run the tests:

```bash
go test ./...
```

Verify the service builds:

```bash
go build ./...
```

## Current scope

This is intentionally a small starter API.

The current implementation uses only the Go standard library and does not yet
include:

* database persistence;
* authentication or authorization;
* CORS middleware;
* third-party HTTP frameworks;
* background workers;
* queues;
* generalized middleware;
* graceful shutdown.

Those capabilities should be introduced only when a concrete application
requirement justifies them.
