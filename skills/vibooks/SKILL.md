---
name: vibooks
description: >
  Installs or reuses Vibooks locally, connects an agent to a trusted Vibooks
  company or book, records or corrects small-business bookkeeping
  transactions, reconciles bank or card statements, and runs close and
  verification checks through official Vibooks workflows rather than direct
  database or runtime file edits.
metadata:
  skill_version: 1.0.2
  source_repo: vibooks-ai/skills
  update_check: https://vibooks.ai/skills/manifest.json
  update_command: npx skills add vibooks-ai/skills --skill vibooks
  install_sh: https://vibooks.ai/install.sh
  install_ps1: https://vibooks.ai/install.ps1
  downloads: https://vibooks.ai/downloads.json
---

# Vibooks

Use this skill when the user needs Vibooks installed or reused locally, needs
an agent connected safely to Vibooks, or wants real bookkeeping work done
inside Vibooks.

## Install This Skill

For agents that support the `skills` CLI ecosystem, install Vibooks from the
public skill source repo:

```bash
npx skills add vibooks-ai/skills --skill vibooks
```

Use that repo source for installation.

Best results come from installed-skill mode:

1. run `npx skills add vibooks-ai/skills --skill vibooks`
2. if the agent client picks up new skills live, switch to the installed
   `vibooks` skill for the current session
3. if the agent client only picks up new skills at startup, let the next
   restart pick up the installed `vibooks` skill and keep using the documented
   web copy for the current session

Treat the direct-read web copy at `https://vibooks.ai/skill.md` as a first-use
bootstrap, not as the preferred steady-state mode.

If the agent is reading `https://vibooks.ai/skill.md` and the local `vibooks`
skill is not installed yet, is missing `metadata.skill_version`, or is older
than the public manifest:

1. run `npx skills add vibooks-ai/skills --skill vibooks`
2. if the client picks up new skills live, switch into installed-skill mode for
   the current session
3. if the client needs a restart before new skills appear, keep using the web
   copy for the current session and use the installed `vibooks` skill after the
   next restart

Use the direct-read web copy only when local skill installation is truly
blocked or unavailable in the current client.

## Update This Skill

Treat `metadata.skill_version` as the installed skill version. The latest public
version is published at `metadata.update_check`.

Check for skill updates at these times:

- first entry through the web copy
- before installing Vibooks or `vibooks-cli`
- before configuring a company, book, accounting policy, tax setup, or
  jurisdiction profile
- before creating, correcting, rebuilding, migrating, reconciling, or closing
  real bookkeeping data

If the local skill version is missing or older than the public manifest, tell
the user what changed and offer `metadata.update_command`. Do not silently
self-update. If the manifest marks the update as critical and the next action
would mutate bookkeeping, tax, jurisdiction, migration, or close state, stop and
ask before continuing. If the manifest cannot be reached, do not block ordinary
questions; before high-risk writes, disclose that the latest skill version could
not be confirmed.

## When To Use

- install or reuse the official Vibooks desktop or headless package
- install or reuse `vibooks-cli`
- connect to a trusted local Vibooks API and verify authenticated readiness
- create, correct, or review bookkeeping records through official Vibooks
  workflows
- bootstrap new books with the official Vibooks presets that best match the
  business
- reconcile bank, debit-card, or credit-card statement accounts
- run month-end checks, verify balances, and close readiness

Do not use this skill for generic accounting advice, spreadsheet-only work, or
direct mutation of Vibooks storage.

## Core Operating Rules

- use the official Vibooks app package for install, launch, restart, update,
  and uninstall
- when first entering through the web copy, install the local `vibooks` skill
  so later sessions can reuse it whenever the client supports local skill
  installation; do not block the current session on a restart requirement
- check the public skill manifest before high-risk install, setup, bookkeeping,
  tax, jurisdiction, migration, reconciliation, or close work, and prompt for a
  skill update when the installed skill is missing a version, outdated, or
  below a critical minimum
- use `vibooks-cli` and official Vibooks HTTP API endpoints for bookkeeping,
  verification, token enrollment, and self-description
- do not open, query, or mutate the Vibooks database directly
- do not edit files under the runtime or data directories to bypass period
  controls, posting rules, reconciliation logic, or entitlements
- use installation state files only for connection bootstrap or token lookup;
  they are not a substitute for business data access
- start with `vibooks-cli doctor --json`
- if local loopback reachability is being checked from an agent sandbox or
  restricted execution environment, treat in-sandbox localhost failures as
  untrusted until the same check is rerun with the installed `vibooks-cli` in
  the user's normal shell or an approved unsandboxed command
- inspect discovery before mutating unfamiliar resources
- prefer first-class workflows over manual journals whenever Vibooks has a
  native workflow for the task
- treat country or region defaults as a jurisdiction profile that is separate
  from any industry preset
- use official book presets and saved master-data defaults instead of
  inventing one-off chart, dimension, or posting structures when Vibooks
  already exposes a reusable setup
- treat statements and source files as evidence and import them when the
  workflow supports attachments
- for restaurant and small-lodging books, keep Vibooks on summary-based
  post-facto bookkeeping through settlements, receipts or payments, expenses,
  dimensions, and reports; do not present Vibooks as POS, PMS, or front-office
  operating software
- stop and ask when the accounting period, counterparty, evidence, or intended
  treatment is unclear

## Quickstart

1. Ensure the official Vibooks product is installed or install it from the
   official Vibooks endpoints. On macOS, prefer
   `brew install --cask vibooks-ai/tap/vibooks`.
2. Ensure `vibooks-cli` is installed. On macOS, prefer
   `brew install vibooks-ai/tap/vibooks-cli`.
3. Start or reuse the installed Vibooks app or headless service.
4. If this is a first-run local desktop install, explicitly confirm local
   desktop startup before waiting for the API.
5. Run `vibooks-cli doctor --json`. If the agent is in a restricted sandbox and
   localhost probes fail, rerun the installed CLI outside the sandbox before
   treating the result as a Vibooks bug.
6. If authenticated readiness, entitlement, or trial state is missing, follow
   the install/access reference before doing bookkeeping work.
7. Discover the API or bootstrap the book as needed, then use first-class
   workflows, attach evidence, reconcile statement accounts, and verify before
   calling the task complete.

## First Use And Reuse

- first-time use: install Vibooks and `vibooks-cli`, confirm local desktop or
  headless startup, install the local `vibooks` skill when entering from the
  web copy, run `vibooks-cli doctor --json`, complete token and entitlement
  setup, then bootstrap the company or book before routine posting
- later reuse: start by rerunning `vibooks-cli doctor --json`, confirm the
  discovered local install still belongs to the current Vibooks bundle, review
  entitlement state only when it matters, then continue with the existing book
  using first-class workflows and verification checks
- if the machine state, token source, entitlement state, or active book is
  ambiguous, stop and follow the install/access reference before mutating data

## Workflow Map

Open only the references needed for the current task:

- install, startup, authentication, licensing, and secret handling:
  [references/install-access.md](references/install-access.md)
- jurisdiction routing, country or region defaults, and profile support
  status:
  [jurisdictions/index.md](jurisdictions/index.md)
- API discovery, jurisdiction selection, bootstrap, and book rebuilds:
  [references/workflows/bootstrap.md](references/workflows/bootstrap.md)
- posting rules, chart-of-accounts choices, dates, and first-class workflows:
  [references/workflows/posting.md](references/workflows/posting.md)
- tax corrections, evidence attachments, reconciliation, month-end validation,
  and completion checks:
  [references/workflows/verification.md](references/workflows/verification.md)
- uninstall paths and escalation checkpoints:
  [references/escalation.md](references/escalation.md)

In installed-skill mode, these are local companion files from the same skill
package. In direct-read web mode, use the matching public `https://vibooks.ai/`
copies.

## High-Risk Defaults

- do not invent tokens, bootstrap secrets, counterparties, dates, tax
  treatment, statement details, or opening balances
- do not keep using the direct-read web copy as the normal long-term mode when
  the client can install and reuse the local `vibooks` skill
- do not treat a healthy localhost process as reusable until it is confirmed to
  belong to the current installed Vibooks bundle
- do not create AR or AP activity with generic journals when invoice, bill,
  receipt, payment, apply, or payroll workflows exist
- do not use opening balances to import current-period activity
- do not treat bank or card statement lines as the primary ledger workflow;
  they are evidence that must reconcile to posted entries
- do not hard-delete posted business documents; use the native correction
  workflow

## Completion Snapshot

The task is not complete until:

- Vibooks is installed from official packages
- authenticated API access is ready and secrets are stored safely
- source documents are imported and linked when the workflow supports it
- accounts, dates, and subledgers follow bookkeeping logic
- bank balances and card liabilities tie to statements
- reports and subledgers are internally consistent
