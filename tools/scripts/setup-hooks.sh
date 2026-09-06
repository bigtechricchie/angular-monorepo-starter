#!/usr/bin/env bash
set -euo pipefail

REPOSITORY_ROOT="$(git rev-parse --show-toplevel)"
HOOKS_DIRECTORY="$(git rev-parse --git-path hooks)"
SOURCE_DIRECTORY="$REPOSITORY_ROOT/tools/hooks"

mkdir -p "$HOOKS_DIRECTORY"

for hook in commit-msg pre-commit pre-push; do
  cp "$SOURCE_DIRECTORY/$hook" "$HOOKS_DIRECTORY/$hook"
  chmod +x "$HOOKS_DIRECTORY/$hook"
done

echo "Git hooks installed."
