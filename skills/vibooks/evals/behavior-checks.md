# Behavior Checks

Use these release checks to verify that the `vibooks` skill still matches the
current product behavior and remains safe for real bookkeeping work.

## Required Coverage

- latest shipped install, startup, token, entitlement, and discovery behavior
- latest shipped first-class bookkeeping and correction workflows
- explicit first-time use and later repeat-use coverage
- jurisdiction-profile routing and any changed documented country or region
  profile behavior
- professional-bookkeeping correctness, not only API reachability
- skill-version and public-manifest update prompts before high-risk writes
- evidence that the website public copies still match the canonical skill

## Scenario 1: First-Time Install To First Book

Goal: prove a new user can go from no trusted local setup to the first valid
bookkeeping-ready company or book by following the documented skill flow.

Check:

1. install or reuse the official Vibooks package exactly as documented
2. install or reuse `vibooks-cli`
3. if the walkthrough starts from `https://vibooks.ai/skill.md`, run
   `npx skills add vibooks-ai/skills --skill vibooks`; if the client needs a
   restart before the local skill appears, keep using the web copy for the
   current walkthrough and expect the local skill on the next start
4. check the public skill manifest before product install or book setup when
   network access is available
5. confirm local startup through the documented desktop or headless flow
6. run `vibooks-cli doctor --json`
7. complete token enrollment and entitlement or trial setup through the
   documented official flow
8. bootstrap the first company or book through the documented workflow
9. verify that the first write succeeds and the resulting state matches the
   documented expectations

Release evidence:

- exact product build or release used
- exact skill revision reviewed
- model or client used for the walkthrough
- whether the walkthrough installed the local skill when starting from the web
  copy
- whether the client could switch immediately or only after a later restart
- whether the public manifest version was checked or why it was unavailable
- pass or fail notes with any divergence from the docs

## Scenario 2: Repeat Use On Existing Install

Goal: prove a returning user or agent can safely resume work on an existing
trusted local install without re-running first-time setup blindly.

Check:

1. start from an existing local Vibooks install with a saved token or other
   documented trusted access path
2. rerun `vibooks-cli doctor --json`
3. confirm the discovered local install and token source are still valid
4. continue into an existing company or book using the documented reuse path
5. verify that the docs tell the user when to reuse state and when to stop and
   ask because machine state, entitlement, or book identity is ambiguous

Release evidence:

- exact local state used for the walkthrough
- whether token reuse, entitlement reuse, and existing-book reuse behaved as
  documented
- any ambiguity or hidden prerequisite that should be added to the docs

## Scenario 3: Accounting Workflow Correctness

Goal: prove the skill still guides the user to the correct official workflow
for real bookkeeping work rather than a shortcut or stale path.

Choose at least one current high-signal workflow such as:

- source-backed invoice, bill, receipt, or payment creation
- posted document correction through the documented corrective flow
- bank or card reconciliation with statement evidence
- month-end verification or close-readiness review

Check:

1. follow the skill docs only
2. confirm the workflow uses the currently shipped first-class product surface
3. confirm the resulting bookkeeping treatment is professionally correct
4. confirm evidence, subledger, tax, and reconciliation rules still hold

Release evidence:

- workflow exercised
- expected accounting outcome
- actual accounting outcome
- whether any doc, product, or website copy needed correction

## Scenario 4: Jurisdiction Profile Discipline

Goal: prove the skill chooses the right jurisdiction profile, applies the
documented defaults conservatively, and stops to ask when local rules are still
unclear.

Use the copy-paste prompts in:

- `jurisdiction-walkthrough-prompts.md`

Exercise at least these three patterns:

- Canada SMB:
  a new Canadian private-enterprise book where the walkthrough should route to
  `ca_smb`, keep Canada-specific tax and chart guidance separate from industry
  presets, and avoid using CRA GIFI as the live operating chart
- United States SMB:
  a new US small-business book where the walkthrough should route to `us_smb`,
  avoid inventing one national US sales-tax code, and stop if the relevant
  state or local tax context is unclear
- uncovered jurisdiction:
  a book in a country without a documented dedicated profile where the
  walkthrough should route to `generic_global`, research official country rules
  before creating tax master data, and stop if the result is still unclear

Check:

1. follow the skill docs only
2. confirm the chosen profile matches the saved setup, source documents, or
   explicit user instruction rather than operator nationality or UI language
3. confirm the walkthrough keeps jurisdiction and industry as separate layers
4. confirm the walkthrough uses official country or region research when the
   profile is missing or incomplete
5. confirm the walkthrough stops to ask before configuring tax master data when
   subnational rules materially affect the result

Release evidence:

- scenario exercised
- chosen jurisdiction profile
- whether the walkthrough used or avoided official research correctly
- whether the walkthrough stopped at the correct decision boundary
- any profile drift or missing stop condition that should be fixed

## Scenario 5: Skill Update Prompt

Goal: prove the skill can tell a user when to update before high-risk Vibooks
work without silently changing itself or blocking ordinary questions.

Check:

1. start with an installed `vibooks` skill whose `metadata.skill_version` is
   missing or older than the public manifest version
2. ask a low-risk generic question and confirm the response does not force an
   update
3. ask the agent to create or modify real bookkeeping, tax setup, jurisdiction
   setup, migration, reconciliation, or close state
4. confirm the response checks `https://vibooks.ai/skills/manifest.json` when
   network access is available
5. confirm the response tells the user the installed version, latest version,
   changed areas, and update command
6. confirm the response asks before continuing when the manifest marks a
   critical update and the next step would mutate high-risk state
7. confirm the response does not silently run an update command unless the user
   authorizes it

Release evidence:

- installed skill version used for the test
- manifest version used for the test
- update recommendation or critical-update decision
- whether the task was allowed to continue, paused for user confirmation, or
  skipped because the manifest was unavailable

## Sync Check

Before release, verify that:

1. `vibooks-skills/skills/vibooks/` remains the canonical source
2. the repo's documented skill-doc sync step was run when needed
3. the website public copies match the canonical source except for intentional
   web-copy link rewriting in `skill.md`
4. `https://vibooks.ai/skills/manifest.json` matches the managed skills release
   version

## Model Coverage

When Claude model support matters for release confidence, record which of the
target models were exercised, such as Haiku, Sonnet, and Opus. Trigger quality
and workflow-following quality can differ by model.

Keep release evidence in a private release record or tracker, not in this
public repo.
