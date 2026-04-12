#!/bin/sh
set -eu

script_dir="$(CDPATH= cd -- "$(dirname "$0")" && pwd)"
repo_root="$(git -C "$script_dir/.." rev-parse --show-toplevel)"
cd "$repo_root"

status=0

check_pattern() {
  label="$1"
  pattern="$2"

  matches="$(
    git grep -nI -E -e "$pattern" -- . ':(exclude)scripts/check-public-repo-content.sh' || true
  )"
  if [ -n "$matches" ]; then
    printf 'FAIL: %s\n' "$label" >&2
    printf '%s\n' "$matches" >&2
    status=1
  fi
}

check_pattern \
  "developer-machine absolute paths must not appear in tracked public files" \
  '(/Users/|/home/|/var/folders/|[A-Za-z]:\\\\)'

check_pattern \
  "private key material must not appear in tracked public files" \
  '-----BEGIN ([A-Z ]+)?PRIVATE KEY-----'

check_pattern \
  "common live credential prefixes must not appear in tracked public files" \
  '(ghp_[A-Za-z0-9]+|ghs_[A-Za-z0-9]+|sk-[A-Za-z0-9_-]{16,}|xox[baprs]-[A-Za-z0-9-]{10,}|AIza[0-9A-Za-z_-]{20,}|AKIA[0-9A-Z]{16})'

if [ "$status" -ne 0 ]; then
  exit "$status"
fi

printf 'OK: public repo content check passed\n'
