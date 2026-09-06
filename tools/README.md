# Tools

Workspace tooling. Everything used to set up, verify, or maintain this
repository — not part of the applications or libraries themselves.

```text
tools/
├── hooks/     native Git hooks
└── scripts/   setup and maintenance scripts
```

## hooks/

Three plain shell scripts, run natively by Git — no Husky and no runtime
dependency:

| Hook         | What it does                                    |
| ------------ | ----------------------------------------------- |
| `pre-commit` | Scans staged changes for common secret patterns |
| `commit-msg` | Enforces Conventional Commits message format    |
| `pre-push`   | Runs a security audit before the push completes |

Hooks aren't active until installed. See `tools/scripts/setup-hooks.sh`.

## scripts/

| Script           | What it does                                                                  |
| ---------------- | ----------------------------------------------------------------------------- |
| `setup-hooks.sh` | Copies the tracked hooks into Git's hooks directory and makes them executable |

Run once after cloning:

```bash
bash tools/scripts/setup-hooks.sh
```

## Why the pre-push audit exists

The pre-push hook runs:

```bash
pnpm audit --audit-level=high
```

before changes leave the local repository.

This is intentionally later than pre-commit: dependency auditing may require
registry access and can be slower than local staged-file checks.

The gate is designed to catch known high or critical dependency vulnerabilities
before code is pushed.

The audit is defense in depth, not a complete supply-chain guarantee. A clean
audit means no matching known advisories were reported at that time; it does
not prove that every dependency is safe.

## Why this folder exists

Git hooks are invoked by Git itself, not run manually like ordinary setup
scripts, so they sit as a sibling of `scripts/`, not nested inside it.

`tools/` is named for its responsibility: everything used to set up, verify,
or maintain the workspace belongs here, and nothing is added until it has a
real, proven job.
