#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# check-tokens.sh — Flag dangling CSS custom-property references
# ═══════════════════════════════════════════════════════════════════════════
#
# Usage:  bash scripts/check-tokens.sh
#
# Extracts every var(--x) in globals.css and verifies that --x is
# declared somewhere in the same file.  Variables provided externally
# (e.g. --font-serif, --font-sans from next/font) are allow-listed.
# ═══════════════════════════════════════════════════════════════════════════

set -euo pipefail

CSS_FILE="src/app/globals.css"
if [ ! -f "$CSS_FILE" ]; then
  echo "ERROR: $CSS_FILE not found. Run from project root."
  exit 1
fi

# External vars provided at runtime by next/font (not declared in globals.css)
ALLOW_LIST="--font-serif
--font-sans"

# Collect all var() references
REFERENCES=$(rg -o 'var\(--[a-zA-Z0-9_-]+\)' "$CSS_FILE" \
  | sed 's/var(//;s/)//' \
  | sort -u)

# Collect all declarations (--xxx: ...)
DECLARATIONS=$(rg -o '^ *--[-a-zA-Z0-9_]+:' "$CSS_FILE" \
  | sed 's/://;s/^[[:space:]]*//' \
  | sort -u)

DANGLING=0

while IFS= read -r ref; do
  # Skip allow-listed externals
  is_allowed=0
  while IFS= read -r allowed; do
    if [ "$ref" = "$allowed" ]; then
      is_allowed=1
      break
    fi
  done <<< "$ALLOW_LIST"
  [ $is_allowed -eq 1 ] && continue

  # Check if declared (use grep -Fx -- to prevent --var being interpreted as flags)
  if ! echo "$DECLARATIONS" | grep -Fx -- "$ref" > /dev/null 2>&1; then
    echo "DANGLING: var($ref) is referenced but never declared in $CSS_FILE"
    DANGLING=1
  fi
done <<< "$REFERENCES"

if [ $DANGLING -eq 0 ]; then
  echo "OK — all var() references in $CSS_FILE have matching declarations."
  exit 0
else
  echo ""
  echo "FAIL — dangling variable(s) found. Fix before deploying."
  exit 1
fi
