#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
OUTPUT_DIR="$SCRIPT_DIR/output"

if [ -z "${TRIGGER_EVAL_COMMAND:-}" ]; then
  TRIGGER_EVAL_COMMAND='claude -p "$TRIGGER_EVAL_QUERY" --output-format json'
fi

if [ -z "${TRIGGER_EVAL_MATCH:-}" ]; then
  TRIGGER_EVAL_MATCH='"type":"tool_use".*"name":"Skill".*"skill":"vibooks"'
fi

TRIGGER_EVAL_RUNS="${TRIGGER_EVAL_RUNS:-3}"
TRIGGER_EVAL_THRESHOLD="${TRIGGER_EVAL_THRESHOLD:-0.5}"
TRIGGER_EVAL_TIMEOUT_MS="${TRIGGER_EVAL_TIMEOUT_MS:-120000}"

mkdir -p "$OUTPUT_DIR"

TRAIN_OUTPUT="$OUTPUT_DIR/trigger-eval-train.json"
VALIDATION_OUTPUT="$OUTPUT_DIR/trigger-eval-validation.json"
COMBINED_OUTPUT="$OUTPUT_DIR/trigger-eval-results.json"
SUMMARY_OUTPUT="$OUTPUT_DIR/trigger-eval-summary.txt"

node "$SCRIPT_DIR/run-trigger-eval.mjs" \
  --queries "$SCRIPT_DIR/train_queries.json" \
  --runs "$TRIGGER_EVAL_RUNS" \
  --threshold "$TRIGGER_EVAL_THRESHOLD" \
  --timeout-ms "$TRIGGER_EVAL_TIMEOUT_MS" \
  --command "$TRIGGER_EVAL_COMMAND" \
  --match "$TRIGGER_EVAL_MATCH" \
  > "$TRAIN_OUTPUT"

node "$SCRIPT_DIR/run-trigger-eval.mjs" \
  --queries "$SCRIPT_DIR/validation_queries.json" \
  --runs "$TRIGGER_EVAL_RUNS" \
  --threshold "$TRIGGER_EVAL_THRESHOLD" \
  --timeout-ms "$TRIGGER_EVAL_TIMEOUT_MS" \
  --command "$TRIGGER_EVAL_COMMAND" \
  --match "$TRIGGER_EVAL_MATCH" \
  > "$VALIDATION_OUTPUT"

node - "$TRAIN_OUTPUT" "$VALIDATION_OUTPUT" > "$COMBINED_OUTPUT" <<'EOF'
const fs = require('node:fs')

const trainPath = process.argv[2]
const validationPath = process.argv[3]
const train = JSON.parse(fs.readFileSync(trainPath, 'utf8'))
const validation = JSON.parse(fs.readFileSync(validationPath, 'utf8'))

process.stdout.write(
  JSON.stringify(
    {
      generated_at: new Date().toISOString(),
      train,
      validation,
    },
    null,
    2,
  ) + '\n',
)
EOF

{
  printf 'combined=%s\n' "$COMBINED_OUTPUT"
  printf 'train=%s\n' "$TRAIN_OUTPUT"
  printf 'validation=%s\n' "$VALIDATION_OUTPUT"
  printf 'command=%s\n' "$TRIGGER_EVAL_COMMAND"
  printf 'match=%s\n' "$TRIGGER_EVAL_MATCH"
  printf 'runs=%s\n' "$TRIGGER_EVAL_RUNS"
  printf 'threshold=%s\n' "$TRIGGER_EVAL_THRESHOLD"
  printf 'timeout_ms=%s\n' "$TRIGGER_EVAL_TIMEOUT_MS"
} > "$SUMMARY_OUTPUT"

printf 'wrote %s\n' "$COMBINED_OUTPUT"
printf 'wrote %s\n' "$TRAIN_OUTPUT"
printf 'wrote %s\n' "$VALIDATION_OUTPUT"
printf 'wrote %s\n' "$SUMMARY_OUTPUT"
