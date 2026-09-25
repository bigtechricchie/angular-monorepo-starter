# Solving Dependency Vulnerabilities

**Push blocked by a vulnerability?** Run `pnpm why <package>` on the package named in the audit output, then follow the workflow below.

## Why this exists

The repository runs `pnpm audit --audit-level=high` before every push.

A high or critical advisory blocks the push. The goal is not to make the audit command green - it is to understand why the vulnerable package is installed and apply the smallest safe fix.

## Workflow

1. **Reproduce.** Run `pnpm audit --audit-level=high`. Note the package, affected range, patched version, severity, and GHSA identifier.

2. **Trace it.** Run `pnpm why <package>` to see which declared dependency brought it into the graph.

3. **Fix at the right level:**

   * Direct dependency → `pnpm add <package>@<patched> --save-exact` (add `-D` for a devDependency).
   * Transitive dependency → update the direct dependency that brings it in, preferring the dependency graph supported and declared by that package rather than forcing a nested version independently.
   * No suitable parent update available → use a pnpm override only after confirming the replacement version is compatible, and leave it visible in `package.json` so reviewers can see the graph was altered intentionally.

4. **Reinstall and re-audit.** Run `pnpm install`, inspect the lockfile diff for anything unexpected such as unrelated upgrades, new packages, or downgrades, then run `pnpm audit --audit-level=high` again.

5. **Run the affected verification:**

   ```text
   pnpm run typecheck:libs
   pnpm run test:libs
   pnpm exec ng test reference-app --watch=false
   pnpm exec ng test portal-app --watch=false
   pnpm exec ng build reference-app
   pnpm exec ng build portal-app
   pnpm audit --audit-level=high
   ```

6. **Review the diff.** Run `git diff`, `git diff --check`, and `git status --short`. Confirm `package.json` and `pnpm-lock.yaml` changed only as expected.

7. **Commit separately**, for example: `security(workspace): update <package> for advisory fix`.

**Never:**

* Bypass the check with `git push --no-verify`.
* Run `pnpm audit --fix` or `pnpm audit --fix=update` and commit the result without reviewing exactly what it changed.
* Loosen a pinned exact version into a range (`^` or `~`) as part of a fix.
* Upgrade an unrelated major version "while you're in there." A security patch commit fixes the vulnerability; it does not absorb a migration.

## Worked example

This example is from 23/09/26.

The pre-push audit blocked a push because the workspace was using:

```text
vitest 4.0.8
```

and `pnpm audit --audit-level=high` reported:

```text
GHSA-5xrq-8626-4rwp
```

The advisory was rated **Critical** and affected Vitest `>=4.0.0,<4.1.0`. Vitest `4.1.0` was listed as a patched release.

We did not bypass the hook or immediately upgrade Vitest to the latest major version.

First we investigated the installed dependency and available updates:

```text
pnpm why vitest
pnpm list vitest @angular/build
pnpm outdated
```

The workspace was using:

```text
@angular/build             22.1.6
@angular/cli               22.1.6

@angular/common            22.1.5
@angular/compiler          22.1.5
@angular/compiler-cli      22.1.5
@angular/core              22.1.5
@angular/forms             22.1.5
@angular/platform-browser  22.1.5
@angular/router            22.1.5

vitest                     4.0.8
```

Newer major versions were also available for Vitest, TypeScript, and jsdom, but this was a security remediation rather than a general dependency-upgrade task.

We therefore avoided unrelated major upgrades such as:

```text
vitest      4 → 5
typescript  6 → 7
jsdom       28 → 30
```

During the investigation we also found a newer **moderate-severity** Vitest advisory:

```text
GHSA-82fw-gwwq-j7x9
```

It affected Vitest versions `>=2.1.0,<4.1.11`, with `4.1.11` listed as a patched release.

Although this second advisory was below the repository's `high` audit threshold, we were already performing a compatible Vitest 4.x security update.

Rather than stopping at the minimum version required for the original critical advisory, we selected:

```text
vitest 4.0.8 → 4.1.11
```

This resolved the newer advisory as part of the same compatible Vitest 4.x remediation.

We also updated the compatible Angular patch releases:

```text
@angular/build             22.1.6 → 22.1.8
@angular/cli               22.1.6 → 22.1.8

@angular/common            22.1.5 → 22.1.7
@angular/compiler          22.1.5 → 22.1.7
@angular/compiler-cli      22.1.5 → 22.1.7
@angular/core              22.1.5 → 22.1.7
@angular/forms             22.1.5 → 22.1.7
@angular/platform-browser  22.1.5 → 22.1.7
@angular/router            22.1.5 → 22.1.7
```

The direct dependency versions remained exactly pinned.

After updating the dependency graph, we verified it with:

```text
pnpm install

pnpm exec ng test reference-app --watch=false
pnpm exec ng test portal-app --watch=false

pnpm exec ng build reference-app
pnpm exec ng build portal-app

pnpm audit --audit-level=high
```

The remediation was committed separately as:

```text
b7e68d7 security(workspace): update Angular and Vitest patches
```

The important part of the investigation was the decision process:

```text
audit blocks push
→ identify the vulnerable package
→ trace why it is installed
→ inspect available patched versions
→ avoid unrelated major upgrades
→ select the smallest compatible patched release
→ update exact versions
→ inspect dependency changes
→ test both applications
→ build both applications
→ audit again
→ commit the remediation separately
```

A patched version number alone was not treated as proof that the problem was resolved.

The final `pnpm audit --audit-level=high` result was used to verify the resulting dependency graph.

## If no patched version exists

Do not ignore the advisory by default.

Investigate first:

* Is the vulnerable code path actually reachable from this repository's usage of the package?
* Is the package used only during development and never shipped?
* Can the dependency be removed or replaced?
* Can the vulnerable feature be disabled or worked around?

If, after investigating, you decide to ignore an advisory, record all of the following wherever the ignore is configured:

* GHSA identifier
* affected package
* why the vulnerable path is unreachable or inapplicable here
* any compensating control in place
* a review or expiry date

Never ignore an advisory just because the dependency is inconvenient to update, tests fail after upgrading, the advisory is old, the package is transitive, or the audit gate is blocking a push.

Those are engineering problems to solve, not security justifications.

## What a clean audit does *not* mean

A passing `pnpm audit --audit-level=high` means no known advisory at or above the configured threshold was reported for this dependency graph at that time.

It does not mean the dependencies are free of unknown vulnerabilities, that lower-severity issues are safe to ignore, or that the application cannot be exploited some other way.

## Rule

> Understand the vulnerable dependency path, apply the smallest safe fix, and verify both security and application behavior.
