#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
OUTPUT_DIR="$SCRIPT_DIR/output"

if [ -z "${TRIGGER_EVAL_COMMAND:-}" ]; then
  TRIGGER_EVAL_COMMAND='claude -p "$TRIGGER_EVAL_QUERY" --output-format stream-json --verbose --allowedTools Skill --permission-mode dontAsk'
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

TRAIN_STATUS=0
node "$SCRIPT_DIR/run-trigger-eval.mjs" \
  --queries "$SCRIPT_DIR/train_queries.json" \
  --runs "$TRIGGER_EVAL_RUNS" \
  --threshold "$TRIGGER_EVAL_THRESHOLD" \
  --timeout-ms "$TRIGGER_EVAL_TIMEOUT_MS" \
  --command "$TRIGGER_EVAL_COMMAND" \
  --match "$TRIGGER_EVAL_MATCH" \
  > "$TRAIN_OUTPUT" || TRAIN_STATUS=$?

VALIDATION_STATUS=0
node "$SCRIPT_DIR/run-trigger-eval.mjs" \
  --queries "$SCRIPT_DIR/validation_queries.json" \
  --runs "$TRIGGER_EVAL_RUNS" \
  --threshold "$TRIGGER_EVAL_THRESHOLD" \
  --timeout-ms "$TRIGGER_EVAL_TIMEOUT_MS" \
  --command "$TRIGGER_EVAL_COMMAND" \
  --match "$TRIGGER_EVAL_MATCH" \
  > "$VALIDATION_OUTPUT" || VALIDATION_STATUS=$?

node - "$TRAIN_OUTPUT" "$VALIDATION_OUTPUT" "$TRAIN_STATUS" "$VALIDATION_STATUS" > "$COMBINED_OUTPUT" <<'EOF'
const fs = require('node:fs')

const trainPath = process.argv[2]
const validationPath = process.argv[3]
const trainStatus = Number(process.argv[4])
const validationStatus = Number(process.argv[5])
const train = JSON.parse(fs.readFileSync(trainPath, 'utf8'))
const validation = JSON.parse(fs.readFileSync(validationPath, 'utf8'))

process.stdout.write(
  JSON.stringify(
    {
      generated_at: new Date().toISOString(),
      execution_failed: Boolean(train.execution_failed || validation.execution_failed),
      train_status: trainStatus,
      validation_status: validationStatus,
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
  printf 'train_status=%s\n' "$TRAIN_STATUS"
  printf 'validation_status=%s\n' "$VALIDATION_STATUS"
} > "$SUMMARY_OUTPUT"

printf 'wrote %s\n' "$COMBINED_OUTPUT"
printf 'wrote %s\n' "$TRAIN_OUTPUT"
printf 'wrote %s\n' "$VALIDATION_OUTPUT"
printf 'wrote %s\n' "$SUMMARY_OUTPUT"

if [ "$TRAIN_STATUS" -eq 2 ] || [ "$VALIDATION_STATUS" -eq 2 ]; then
  exit 2
fi
if [ "$TRAIN_STATUS" -ne 0 ]; then
  exit "$TRAIN_STATUS"
fi
exit "$VALIDATION_STATUS"
