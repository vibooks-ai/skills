# Vibooks Skill Release Evidence Template

Copy this template into a private release tracker or release note for the
current `skills` train candidate. Do not commit a filled copy to this public
repository.

## Candidate

- candidate commit SHA:
- planned release tag or version:
- exact product build or release reviewed against:
- exact skill revision reviewed:
- review date:
- reviewer:
- models or clients exercised:
- walkthrough entry mode:
  - web copy `https://vibooks.ai/skill.md`
  - installed local `vibooks` skill

## Trigger Eval Evidence

- train query set reviewed:
- validation query set reviewed:
- runner command used:
- trigger-match rule used:
- train result:
- validation result:
- false positives or false negatives:
- action required before release:

## Behavior Review Summary

### Scenario 1: First-Time Install To First Book

- status: pass / fail / blocked
- notes:
- manifest checked or unavailable reason:
- local skill installation path observed:
- first write result:

### Scenario 2: Repeat Use On Existing Install

- status: pass / fail / blocked
- notes:
- local state used:
- token reuse result:
- entitlement reuse result:
- existing-book reuse result:

### Scenario 3: Accounting Workflow Correctness

- status: pass / fail / blocked
- workflow exercised:
- expected accounting outcome:
- actual accounting outcome:
- doc or product drift:

### Scenario 4: Jurisdiction Profile Discipline

- status: pass / fail / blocked
- scenario exercised:
- chosen profile:
- official research used correctly:
- stop boundary honored:
- profile drift:

### Scenario 5: Skill Update Prompt

- status: pass / fail / blocked
- installed skill version used for the test:
- manifest version used for the test:
- update recommendation shown:
- task continued or paused correctly:

## Sync And Packaging Checks

- `make check-skill-docs-sync` result:
- website public copies resynced when needed:
- website `public/skills/manifest.json` matches the managed skills version:
- legacy public skill copies absent:

## Review Notes

- professional-bookkeeping review:
- mainstream bookkeeping UX parity review:
- Claude Agent Skills best-practice review:
- remaining risks or deferred checks:
- final release recommendation:
