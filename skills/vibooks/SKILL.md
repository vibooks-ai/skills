---
name: vibooks
description: >
  Installs or reuses Vibooks locally, connects an agent to a trusted Vibooks
  company or book, records or corrects small-business bookkeeping
  transactions, reconciles bank or card statements, and runs close and
  verification checks. Use when the user wants official Vibooks workflows
  rather than direct database or runtime file edits.
metadata:
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
npx skills add vibooksai/skills --skill vibooks
```

Use that repo source for installation.

Best results come from installed-skill mode:

1. install `vibooks` from `vibooksai/skills`
2. if the agent client refreshes skills only at startup, restart or refresh the
   client after installation
3. ask the agent to use the installed `vibooks` skill

If installing is inconvenient or a restart is not possible right now, use the
direct-read web copy at `https://vibooks.ai/skill.md` and follow the companion
docs linked below.

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
- use `vibooks-cli` and official Vibooks HTTP API endpoints for bookkeeping,
  verification, token enrollment, and self-description
- do not open, query, or mutate the Vibooks database directly
- do not edit files under the runtime or data directories to bypass period
  controls, posting rules, reconciliation logic, or entitlements
- use installation state files only for connection bootstrap or token lookup;
  they are not a substitute for business data access
- start with `vibooks-cli doctor --json`
- inspect discovery before mutating unfamiliar resources
- prefer first-class workflows over manual journals whenever Vibooks has a
  native workflow for the task
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
   official Vibooks endpoints.
2. Ensure `vibooks-cli` is installed.
3. Start or reuse the installed Vibooks app or headless service.
4. If this is a first-run local desktop install, explicitly confirm local
   desktop startup before waiting for the API.
5. Run `vibooks-cli doctor --json`.
6. If authenticated readiness, entitlement, or trial state is missing, follow
   the install/access reference before doing bookkeeping work.
7. Discover the API or bootstrap the book as needed, then use first-class
   workflows, attach evidence, reconcile statement accounts, and verify before
   calling the task complete.

## First Use And Reuse

- first-time use: install Vibooks and `vibooks-cli`, confirm local desktop or
  headless startup, run `vibooks-cli doctor --json`, complete token and
  entitlement setup, then bootstrap the company or book before routine posting
- later reuse: start by rerunning `vibooks-cli doctor --json`, confirm the
  discovered local install still belongs to the current Vibooks bundle, review
  entitlement state only when it matters, then continue with the existing book
  using first-class workflows and verification checks
- if the machine state, token source, entitlement state, or active book is
  ambiguous, stop and follow the install/access reference before mutating data

## Workflow Map

Open only the references needed for the current task:

- install, startup, authentication, licensing, and secret handling:
  [skill-install-and-access.md](skill-install-and-access.md)
- discovery, bootstrap, book rebuilds, posting rules, chart-of-accounts
  choices, dates, and first-class workflows:
  [skill-bookkeeping-workflows.md](skill-bookkeeping-workflows.md)
- tax corrections, evidence attachments, reconciliation, month-end validation,
  and completion checks:
  [skill-controls-and-verification.md](skill-controls-and-verification.md)
- uninstall paths and escalation checkpoints:
  [skill-maintenance-and-escalation.md](skill-maintenance-and-escalation.md)

In installed-skill mode, these are local companion files from the same skill
package. In direct-read web mode, use the matching public `https://vibooks.ai/`
copies.

## High-Risk Defaults

- do not invent tokens, bootstrap secrets, counterparties, dates, tax
  treatment, statement details, or opening balances
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
