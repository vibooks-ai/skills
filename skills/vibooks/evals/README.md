# Trigger Evals

This folder contains trigger-evaluation inputs for the `vibooks` skill.

These trigger evals are necessary but not sufficient for release readiness.
They verify discovery quality for the skill `description`; they do not prove
that the documented bookkeeping workflows remain correct against the current
product.

Use `train_queries.json` while iterating on the `description` field, then use
`validation_queries.json` as the holdout set to check whether the improved
description generalizes.

Recommended loop:

1. run the train set
2. inspect false negatives and false positives
3. tighten or broaden the `description` field without overfitting to exact
   words from failed queries
4. rerun the train set
5. when the train set looks good, run the validation set

For release review, also run behavior checks that cover:

1. first-time install and first authenticated bookkeeping use
2. repeat use against an existing trusted local install and existing book
3. a correction, reconciliation, or verification workflow that exercises the
   current official product behavior
4. jurisdiction-profile routing for at least one covered country, one covered
   country with strong subnational tax variation, and one uncovered country
5. skill-version and public-manifest update prompting before high-risk writes

For manual walkthroughs, use:

- `behavior-checks.md` for the required coverage and pass criteria
- `jurisdiction-walkthrough-prompts.md` for copy-paste prompts and expected
  routing behavior
- `release-evidence-template.md` as the public template to copy into a private
  release record before approving a candidate release

For any release candidate that changes `SKILL.md`, jurisdiction profiles,
workflow references, or skill-update prompting, copy
`release-evidence-template.md` into a private tracker and fill it for the
candidate commit or planned tag before calling the `skills` train release-ready.

Record which target models were exercised and keep release evidence in a
private release record or tracker, not in this public repo. At minimum, review
the scenarios in `behavior-checks.md`.

## Generic Runner

Use `run-trigger-eval.mjs` with any client that can:

- run a prompt non-interactively
- expose enough stdout or stderr to detect whether the `vibooks` skill was
  actually consulted

Example shape:

```bash
node evals/run-trigger-eval.mjs \
  --queries evals/train_queries.json \
  --runs 3 \
  --command 'claude -p "$TRIGGER_EVAL_QUERY" --output-format json' \
  --match '"type":"tool_use".*"name":"Skill".*"skill":"vibooks"'
```

The runner injects each prompt into the command through the
`TRIGGER_EVAL_QUERY` environment variable and marks the run as triggered when
the combined stdout/stderr matches the supplied regex.

For release review, you can also use the local wrapper script to write a
combined result file plus the raw train and validation output files into
ignored local artifacts under `evals/output/`:

```bash
cd skills/vibooks
./evals/run-release-trigger-evals.sh
```

By default that wrapper uses:

```bash
claude -p "$TRIGGER_EVAL_QUERY" --output-format json
```

Override the client command when needed:

```bash
TRIGGER_EVAL_COMMAND='your-client -p "$TRIGGER_EVAL_QUERY" --output-format json' \
  ./evals/run-release-trigger-evals.sh
```

The main file to review after the run is:

```text
evals/output/trigger-eval-results.json
```
