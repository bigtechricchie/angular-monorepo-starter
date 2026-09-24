# Security Decisions

This repository treats security as an engineering constraint rather than a feature added at the end.

The goal is not to claim that the starter is inherently secure or production-ready. Instead, the repository demonstrates deliberate choices that reduce unnecessary attack surface, make trust boundaries explicit, and keep security-sensitive behavior visible and reviewable.

## Principles

The repository follows several recurring security principles:

* Minimize dependencies and tooling.
* Pin direct dependency and tool versions exactly.
* Treat external data as untrusted until validated.
* Prefer explicit trust boundaries over type assertions.
* Fail closed when repository tooling cannot safely determine what to verify.
* Avoid exposing unnecessary implementation or transport details.
* Introduce security mechanisms only when they address a concrete risk.
* Keep security-sensitive changes small enough to review.

## Dependency policy

### Exact versions

Direct dependencies and core tooling are pinned to exact versions rather than version ranges.

This avoids silently accepting a different version during a future install merely because it satisfies `^` or `~` semantics.

### pnpm engine enforcement

The workspace declares the expected Node and pnpm versions and enables strict engine handling.

This reduces differences between developer environments and makes toolchain expectations explicit.

### Minimum package release age

pnpm is configured with a minimum release age before newly published packages can normally enter the dependency graph.

This creates a delay between publication and adoption, giving compromised or malicious releases additional time to be discovered before they are consumed automatically.

The policy is defense in depth and does not guarantee that an older package is safe.

### Explicit dependency build permissions

Packages that need installation-time build scripts are explicitly reviewed and allowed.

The workspace does not broadly permit arbitrary dependency build scripts without consideration.

This reduces the amount of dependency code allowed to execute during installation.

### High-severity dependency audit

Every push runs:

```text
pnpm audit --audit-level=high
```

The push fails when matching known high or critical dependency advisories are reported.

A clean audit does not prove that dependencies are safe. It means no matching known advisories were reported by the audit source at that time.

## Minimal tooling surface

The repository deliberately avoids adding tooling solely because it is common in other projects.

### No Husky

Git hooks are implemented with native Git hooks rather than introducing Husky.

This keeps the mechanism visible and avoids an additional runtime/tooling dependency for behavior Git already supports natively.

### No Prettier by default

The repository currently does not include Prettier.

This is not because Prettier is considered insecure.

The decision is based on keeping the dependency and tooling surface small until automated formatting provides enough value to justify another dependency and configuration layer.

Formatting conventions can be reconsidered if repeated formatting problems demonstrate a concrete need.

### No monorepo task runner by default

The repository does not currently use Nx or Turborepo.

The current dependency graph and affected-test logic are small enough to remain understandable using native scripts and Git hooks.

A larger orchestration tool should be introduced only if repository complexity proves that it is needed.

### No unnecessary Angular library packaging

Internal libraries are consumed directly from source.

The repository does not introduce `ng-packagr`, independent package manifests, publishing pipelines, or separate versioning for internal capabilities unless publication becomes a real requirement.

## Git security gates

### Pre-commit secret scanning

The native pre-commit hook checks staged changes for common secret and private-key patterns.

The purpose is to catch obvious accidental secret commits before they enter repository history.

This is a lightweight defense and does not replace dedicated secret-management systems or broader scanning in CI.

### Conventional commit validation

The commit-message hook enforces the repository's Conventional Commits format.

This is primarily a maintainability control, but it also improves auditability by making security, dependency, refactor, and feature changes easier to identify in repository history.

### Dependency-aware pre-push checks

The pre-push hook determines which verification steps are required from the files being pushed.

Shared-library changes run:

```text
library type-check
library tests
reference-app tests
portal-app tests
```

Application-only changes run the affected application tests.

Shared workspace configuration runs the shared-library checks and both Angular application test suites.

Tooling changes run the full gate.

### Fail-closed hook behavior

If the pre-push hook cannot safely calculate the changes because the previous remote commit is unavailable locally, it falls back to the full verification gate.

It does not silently skip testing when the affected scope is uncertain.

### Hook input protection

Git supplies pushed references through standard input.

Commands that run before the hook processes those references do not receive that input, preventing another process from accidentally consuming the data needed by the hook.

## TypeScript safety

### Strict compiler configuration

The repository enables strict TypeScript checks including:

```text
strict
noImplicitOverride
noPropertyAccessFromIndexSignature
noImplicitReturns
noFallthroughCasesInSwitch
noUncheckedIndexedAccess
exactOptionalPropertyTypes
noUnusedLocals
noUnusedParameters
forceConsistentCasingInFileNames
```

These settings reduce implicit assumptions and make potentially unsafe states more visible during development.

### Framework-neutral library type checking

Shared TypeScript libraries have their own type-check target.

They inherit the repository-wide strict policy while using:

```text
lib: ["ES2022"]
types: []
```

This prevents browser DOM globals from becoming accidental dependencies of framework-neutral shared libraries.

### Explicit test imports

Vitest APIs are imported explicitly rather than relying on globally injected test functions.

For example:

```text
import { describe, expect, it } from 'vitest';
```

This makes test dependencies visible in the source and avoids hidden ambient test APIs.

## Defensive API boundaries

### Network responses are untrusted runtime data

Angular HTTP consumers do not trust backend response types simply because TypeScript generics are available.

Shared API parsers receive transport data as `unknown` and validate it before exposing trusted application contracts.

For example, the health response follows this boundary:

```text
HTTP response
→ unknown
→ runtime parser
→ trusted HealthResponse
```

A TypeScript generic can describe the expected result to the compiler, but it does not validate the actual network payload at runtime.

### Runtime response validation

The shared health API capability validates that a response:

* is an object,
* is not `null`,
* is not an array,
* contains the expected `status` property,
* contains exactly the supported health status.

Only then does the value become a trusted `HealthResponse`.

### Normalized trusted objects

The health parser constructs a new response object after validation instead of returning or casting the original transport object.

For example, an incoming response such as:

```text
{
  "status": "ok",
  "unexpected": "value"
}
```

becomes internally:

```text
{
  "status": "ok"
}
```

Unexpected transport properties therefore do not automatically propagate into trusted application data.

### No unsafe type assertions at the trust boundary

The parser does not use:

```text
value as HealthResponse
```

to establish trust.

A TypeScript assertion does not perform runtime validation and would allow malformed external data to masquerade as a trusted application type.

### Typed contract errors

Invalid health responses throw:

```text
InvalidHealthResponseError
```

rather than relying on comparison of human-readable error strings.

Application code can therefore distinguish a contract-validation failure using the error type itself.

### Safe normalized error messages

Transport and HTTP failures are normalized before reaching presentation code.

Raw backend response bodies and Angular transport details are not automatically exposed in user-facing errors.

Tests explicitly verify that simulated sensitive backend details do not appear in normalized error messages.

## Frontend architecture

### Applications do not depend on one another

`reference-app` and `portal-app` are independent composition roots.

Neither application imports code from the other.

Reusable capabilities are extracted into shared libraries only after reuse has been demonstrated.

This avoids creating hidden coupling between independently evolving applications.

### Shared libraries own capabilities, not application composition

The repository follows:

> **Applications own composition. Libraries own capabilities.**

For example, `libs/api` owns the shared backend health contract and runtime parser.

Applications continue to own:

```text
routes
pages
templates
presentation state
Angular HTTP orchestration
user-facing error behavior
```

This keeps shared code from accumulating product-specific state or UI responsibilities.

### Framework-neutral API library

`libs/api` is plain TypeScript.

It does not depend on:

```text
Angular
Angular dependency injection
RxJS
signals
application components
```

This keeps the backend contract independent of whichever frontend mechanism consumes it.

## Go API

### Standard-library-first implementation

The Go API currently uses the standard library rather than adding an HTTP framework without a demonstrated requirement.

This reduces dependencies and keeps HTTP behavior directly visible.

### Explicit port validation

The `PORT` environment value is parsed and validated before the server starts.

Only valid TCP port values from `1` through `65535` are accepted.

Invalid configuration causes startup to fail rather than silently falling back to an unexpected value.

### HTTP timeouts and request limits

The server configures HTTP protections such as timeouts and request limits rather than relying only on default server behavior.

These controls reduce exposure to clients that hold connections or requests open unexpectedly.

### `X-Content-Type-Options`

HTTP responses include:

```text
X-Content-Type-Options: nosniff
```

to prevent browsers from MIME-sniffing content away from the declared response type.

### Namespaced API endpoints

Backend endpoints are namespaced under:

```text
/api/
```

For example:

```text
GET /api/health
```

This establishes a clear boundary between frontend routes and backend HTTP operations.

### No unnecessary CORS configuration

Local Angular development uses the Angular development proxy to reach the Go API.

The repository does not enable permissive CORS simply to make local development work.

CORS policy should be introduced only when the deployment topology actually requires cross-origin access.

## CSS and frontend styling

The repository uses modern native CSS by default.

It does not currently include Sass, Less, CSS-in-JS, or runtime styling libraries.

This decision is not a claim that those technologies are inherently insecure.

It reflects the repository's general preference to avoid additional compiler, runtime, and dependency layers until their capabilities are genuinely required.

## What the repository deliberately does not claim

These controls improve the starter's security posture, but they do not make the repository:

```text
secure by default
production-ready
enterprise-grade
banking-grade
immune to supply-chain compromise
a replacement for CI/CD security controls
```

Security depends on the application built from the starter, its deployment environment, its authentication and authorization model, infrastructure, data sensitivity, dependency state, operational controls, and ongoing maintenance.

The purpose of this repository is to demonstrate deliberate security-oriented engineering decisions with boundaries that remain understandable and reviewable.
