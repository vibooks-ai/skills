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
- downloads versions and plugin version facts used for the test:
- cache path, schema, timestamps, and fresh/stale decision:
- standalone or plugin mode:
- `vibooks_update_status` call count and `includeNetwork` value:
- public-catalog request count by exact URL:
- invalid-catalog cases failed closed without advancing freshness:
- partial-success, merge, concurrent-newer-entry, and future-schema result:
- permission, sandbox, or read-only persistence failure result:
- `vibooks-agent.env` remained unread and unchanged:
- update recommendation shown:
- task continued or paused correctly:

### Scenario 6: Independent Evidence Review

- status: pass / fail / blocked
- scope and denominator:
- original evidence and read-only ledger surface used:
- prohibited prior artifacts avoided:
- item-by-item and coverage result:
- sampling or materiality boundary honored:
- ledger mutation avoided or explicitly approved:

### Scenario 7: Jurisdiction-Sensitive Statement Evidence

- status: pass / fail / blocked
- jurisdiction profile exercised:
- statement evidence reviewed:
- per-line transaction date:
- per-line posting date:
- statement period-end or closing date:
- cross-period cutoff result:
- accounting basis used:
- payment or receipt support result:
- business-nature support result:
- recognition-date support result:
- tax-documentation support result:
- official authority consulted when required:
- missing source documents or prescribed fields:
- unresolved deduction or commodity-tax conclusion:
- suspense entry used or reconciliation kept blocked:

### Scenario 8: Canadian Payroll And Pay Statements

- status: pass / fail / blocked
- product and skill revisions reviewed:
- jurisdiction, employee class, period, and pay date:
- readiness and selected rule release/revision:
- preview, post, journal, statement, vacation, and paper-handoff result:
- correction plan and successor-lineage result:
- API-only parity result:
- remittance preview/preparation result:
- external-payment evidence and ledger-settlement separation result:
- T4/RL-1 preview, annual-facts, and adjustment-lineage result:
- live T4 employee-PDF and CRA-XML package readiness, including unavailable-path result:
- employee/province PDF intent, native-only sensitive entry/save, reserved-copy replacement, and paper-delivery result:
- ROE reviewed worksheet, live package/options readiness, native draft `.BLK` handoff, and external issue/PDF boundary:
- API/CLI/prompt/log sensitive-identifier exclusion result:
- filing, authority acceptance, and employee-distribution boundary result:
- unsupported boundary or documentation drift:

### Scenario 9: Customer Invoicing And Prepayments

- status: pass / fail / blocked
- exact product build, client protocol, skill revision, and client:
- recurring-service invoice and later-receipt result:
- explicit due date and derivation evidence:
- one-off non-inventory service result:
- inventory Item, stock issue, COGS/inventory, tax, and GL result:
- immediate-sale workflow and payment-account result:
- customer and Item reuse/create/conflict result:
- invoice readback, separate Item read, and render result:
- future-invoice prepayment and later application result:
- direct-recognition schedule facts and posting result:
- active-schedule application rejection and unchanged-state result:
- latest-first reversal, schedule cancellation, and receipt recovery result:
- unsupported advance-invoice stop result:
- invoice or receipt correction action exercised:
- canonical, website, portable plugin, and Codex-wrapper parity result:

## Sync And Packaging Checks

- `make check-skill-docs-sync` result:
- `./scripts/check-public-repo-content.sh` result:
- confirmed all externally published skill surfaces are free of local paths, private keys, tokens, and other sensitive machine-specific data:
- website public copies resynced when needed:
- website `public/skills/manifest.json` matches the managed skills version:
- legacy public skill copies absent:

## Review Notes

- professional-bookkeeping review:
- mainstream bookkeeping UX parity review:
- Claude Agent Skills best-practice review:
- remaining risks or deferred checks:
- final release recommendation:
