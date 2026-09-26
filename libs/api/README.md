# @lib/api

Framework-neutral API contracts and runtime boundary logic shared by
applications.

The library is consumed directly from source through the `@lib/api` path
alias. It is not packaged or published.

## Responsibilities

`@lib/api` owns:

- API endpoint constants
- response contracts
- runtime response parsers
- contract-specific errors

It does not own:

- HTTP clients
- Angular services
- RxJS
- application state
- routing
- presentation
- backend implementation

Applications decide how requests are made. `@lib/api` defines what a valid
response looks like.

## Runtime boundary

Network data is untrusted at runtime.

The intended flow is:

```text
HTTP response
→ unknown
→ runtime parser
→ trusted contract
```

TypeScript generics provide compile-time information only. They do not
validate runtime data.

Parsers therefore accept `unknown`, validate the expected structure, and
return a normalized contract value.

## Health contract

The health capability currently exposes:

```text
healthEndpoint
HealthResponse
parseHealthResponse()
InvalidHealthResponseError
```

`parseHealthResponse()` validates the runtime response and returns a new
normalized object rather than trusting the original value.

Unexpected response shapes produce the typed
`InvalidHealthResponseError`.

Applications may translate that error into user-facing presentation without
exposing backend or transport details.

## Environment boundary

`@lib/api` is intentionally framework-neutral.

Its TypeScript configuration uses:

```text
ES2022
```

without DOM libraries.

This helps prevent accidental dependencies on browser APIs such as
`window` or `document`.

The library must not depend on Angular or application code.

## Testing

Tests run through the plain library Vitest configuration in a Node
environment.

Run API library tests:

```text
pnpm run test:api-lib
```

Run all library tests:

```text
pnpm run test:libs
```

Tests should cover:

- valid response parsing
- invalid response rejection
- normalization behavior
- contract-specific errors
- defensive runtime edge cases

Vitest APIs are imported explicitly rather than supplied through ambient
globals.

## Public API

Consumers import from:

```text
@lib/api
```

Exports are defined in:

```text
src/public-api.ts
```

Consumers should not deep-import internal files.

## Rules

- Keep the library framework-neutral.
- Treat runtime network values as `unknown`.
- Validate before trusting.
- Do not use type assertions to bypass validation.
- Keep endpoint and contract definitions reusable.
- Keep HTTP orchestration inside applications.
- Do not depend on applications.
- Keep the public API small.
