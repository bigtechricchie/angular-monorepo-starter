# Tools

Workspace tooling. Everything used to set up, verify, or maintain this repository - not part of the applications or libraries themselves.

```text
tools/
├── hooks/     native Git hooks
└── scripts/   setup and maintenance scripts
```

## hooks/

Three plain shell scripts, run natively by Git - no Husky and no runtime dependency:

| Hook         | What it does                                                                               |
| ------------ | ------------------------------------------------------------------------------------------ |
| `pre-commit` | Scans staged changes for common secret patterns                                            |
| `commit-msg` | Enforces Conventional Commits message format                                               |
| `pre-push`   | Runs dependency auditing and affected library/application checks before the push completes |

Hooks aren't active until installed. See `tools/scripts/setup-hooks.sh`.

## scripts/

| Script           | What it does                                                                  |
| ---------------- | ----------------------------------------------------------------------------- |
| `setup-hooks.sh` | Copies the tracked hooks into Git's hooks directory and makes them executable |

Run after cloning and whenever a tracked hook changes:

```bash
bash tools/scripts/setup-hooks.sh
```

## Why the pre-push checks exist

The pre-push hook always runs:

```bash
pnpm audit --audit-level=high
```

before changes leave the local repository.

It then determines which additional checks are required from the files being pushed.

```text
libs/**
→ shared library type-check
→ shared library tests
→ reference-app tests
→ portal-app tests

projects/reference-app/**
→ reference-app tests

projects/portal-app/**
→ portal-app tests

package.json
pnpm-lock.yaml
tsconfig.json
→ shared library type-check
→ shared library tests
→ both Angular application test suites

angular.json
→ both Angular application test suites

tools/**
→ shared library type-check
→ shared library tests
→ both Angular application test suites

documentation-only changes
→ dependency audit only
```

A newly pushed remote ref runs the shared library checks and both Angular application test suites because there is no previous remote commit to compare safely.

If the previous remote commit cannot be resolved locally, the hook falls back to the full gate rather than skipping affected checks.

The shared library checks are:

```text
pnpm run typecheck:libs
pnpm run test:libs
```

These checks intentionally run later than pre-commit. Dependency auditing may require registry access, and library/application test suites are more expensive than staged-file checks.

The gate is designed to catch:

```text
known high or critical dependency vulnerabilities
type errors in shared TypeScript libraries
failing shared library tests
failing tests in affected Angular applications
```

before code is pushed.

The audit is defense in depth, not a complete supply-chain guarantee. A clean audit means no matching known advisories were reported at that time; it does not prove that every dependency is safe.

Similarly, passing the selected checks verifies the code paths exercised by the push, but does not replace broader CI validation.

## Verifying the installed hooks

After installing or updating the hooks, confirm that the installed pre-push hook matches the tracked version:

```bash
cmp tools/hooks/pre-push "$(git rev-parse --git-path hooks)/pre-push"
```

No output means the files match.

You can also confirm that the installed hook is executable:

```bash
ls -l "$(git rev-parse --git-path hooks)/pre-push"
```

## Why this folder exists

Git hooks are invoked by Git itself, not run manually like ordinary setup scripts, so they sit as a sibling of `scripts/`, not nested inside it.

`tools/` is named for its responsibility: everything used to set up, verify, or maintain the workspace belongs here, and nothing is added until it has a real, proven job.
