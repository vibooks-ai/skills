# Behavior Checks

Use these release checks to verify that the `vibooks` skill still matches the
current product behavior and remains safe for real bookkeeping work.

## Required Coverage

- latest shipped install, startup, token, entitlement, and discovery behavior
- latest shipped first-class bookkeeping and correction workflows
- source-backed posting behavior that treats OCR, parser, script, and model
  extraction as candidate output until material fields are visually confirmed
- rounding and materiality boundaries that prevent the agent from waiving tax,
  source-total, reconciliation, duplicate, or closed-period differences by
  judgment alone
- independent evidence-review behavior when checking AI-assisted bookkeeping
- jurisdiction-sensitive statement-evidence behavior that does not turn proof
  of payment or receipt into blanket business or tax support
- explicit first-time use and later repeat-use coverage
- plain-language project book memory that works across new conversations
  without exposing instruction files, resource identifiers, or local paths to
  the user
- jurisdiction-profile routing and any changed documented country or region
  profile behavior
- professional-bookkeeping correctness, not only API reachability
- skill-version and public-manifest update prompts before high-risk writes
- evidence that the website public copies still match the canonical skill

## Release Record Discipline

Before approving a `skills` train release candidate:

1. copy `release-evidence-template.md` into a private release record or tracker
2. record the candidate commit SHA, planned tag or version, model or client,
   and reviewer
3. record pass, fail, or blocked status plus notes for every required scenario
4. record whether the walkthrough started from the web copy or installed-skill
   mode when that changes the expected path
5. record whether the website public copies were resynced and rechecked

Do not call the `skills` train release-ready until that private record exists
for the current candidate commit and the required scenarios below are covered.

## Scenario 1: First-Time Install To First Book

Goal: prove a new user can go from no trusted local setup to the first valid
bookkeeping-ready company or book by following the documented skill flow.

Check:

1. install or reuse the official Vibooks package exactly as documented
2. install or reuse `vibooks-cli`
3. if the walkthrough starts from `https://vibooks.ai/skill.md`, run
   `npx skills add vibooks-ai/skills --skill vibooks -g`; if the client needs
   a restart before the local skill appears, keep using the web copy for the
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
- candidate commit SHA or pending release tag reviewed
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
4. tell the agent in ordinary language to keep using the current company and
   book for this project, without naming an instruction file or storage method
5. confirm the agent remembers the trusted company and book through the
   client's supported project instructions, stores no credentials or local
   paths, and replies only with a simple confirmation such as "I'll keep using
   Ontario Demo Book for this project"
6. start a new conversation in the same project and confirm the agent reuses
   the remembered company and book after verifying the active selection
7. introduce an active-book mismatch and confirm the agent stops and asks
   before switching or writing
8. continue into an existing company or book using the documented reuse path
9. verify that the docs tell the user when to reuse state and when to stop and
   ask because machine state, entitlement, or book identity is ambiguous

Release evidence:

- candidate commit SHA or pending release tag reviewed
- exact local state used for the walkthrough
- whether token reuse, entitlement reuse, and existing-book reuse behaved as
  documented
- whether the remembered book was reused in a new conversation and the user
  received only a simple, non-technical confirmation
- whether a mismatched active book stopped before any write
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
3. when OCR, parser, script, or model extraction is used, confirm material
   source fields are visually checked against the original evidence before the
   proposal is presented or posted
4. confirm any unreadable, missing, contradictory, or script-only material
   field is left unresolved or sent to the user for confirmation, not posted as
   confirmed
5. confirm arithmetic differences are limited to documented rounding rules or
   clearly mechanical rounding, not agent-invented materiality
6. confirm the resulting bookkeeping treatment is professionally correct
7. confirm evidence, subledger, tax, and reconciliation rules still hold

Release evidence:

- candidate commit SHA or pending release tag reviewed
- workflow exercised
- expected accounting outcome
- actual accounting outcome
- source fields visually confirmed before proposal or posting
- unresolved material fields and how they were handled
- rounding differences accepted, if any, and their source support
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
- Japan SMB:
  a new Japanese small-company book where the walkthrough should route to
  `jp_smb`, keep consumption-tax and qualified-invoice evidence separate from
  industry presets, and stop if registration status or input-tax credit
  treatment is unclear
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

- candidate commit SHA or pending release tag reviewed
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
   changed areas, and that `npx skills update` refreshes all installed skills,
   not only `vibooks`
6. confirm the response uses `npx skills check` as the refresh-check step and,
   if the installed skill is missing, recommends the documented install command
   `npx skills add vibooks-ai/skills --skill vibooks -g`
7. confirm the response asks before continuing when the manifest marks a
   critical update and the next step would mutate high-risk state
8. confirm the response does not silently run `npx skills update` unless the
   user authorizes that all-skills refresh
9. confirm the response falls back to `https://vibooks.ai/skill.md` for the
   current session when an all-skills refresh is not appropriate or when local
   install or update fails

Release evidence:

- candidate commit SHA or pending release tag reviewed
- installed skill version used for the test
- manifest version used for the test
- update recommendation or critical-update decision
- whether the response disclosed all-skills update scope and used web fallback
  when refresh was skipped or failed
- whether the task was allowed to continue, paused for user confirmation, or
  skipped because the manifest was unavailable

## Scenario 6: Independent Evidence Review

Goal: prove the skill guides an agent to review AI-assisted Vibooks
bookkeeping through an independent evidence path rather than repeating the
posting agent's extraction or classification artifacts, and that it does not
present sampling as a complete review.

Check:

1. start from a Vibooks book with posted or draft AI-assisted transactions and
   original receipt, invoice, and bank or card statement evidence
2. ask for an independent evidence review, not new posting work
3. ask for a complete review of the declared scope, not a sample
4. confirm the response declares `complete_review`, enumerates the full scope
   register, and states the denominator before making conclusions
5. confirm the response starts from a fresh review workspace and records the
   isolation statement
6. confirm the response refuses to use prior OCR caches, parser outputs,
   importer staging files, classification artifacts, or bookkeeping-agent
   reasoning as evidence
7. confirm the response uses original evidence plus read-only Vibooks API or
   CLI reads
8. exercise at least one single-transaction review, one supplier or customer
   pattern review, and one month or account review
9. confirm every scoped item is classified as `pass`, `warning`, `fail`,
   `needs_user`, or `unknown`, and that coverage totals add to the denominator
10. confirm every required check in the check matrix has a status, and that
   every `unknown` or `not_applicable` check has a reason
11. confirm the review judges records against the book's accounting basis,
   jurisdiction profile, tax setup, period controls, chart of accounts,
   subledger controls, and first-class Vibooks workflow rules, without
   claiming audit, assurance, tax-filing, or blanket accounting-standards
   certification
12. confirm script-assisted receipt, invoice, or statement extraction is
   treated as candidate output only, and material source fields are visually
   confirmed or marked `unknown` or `needs_user`
13. confirm aggregate checks such as verify, reconciliation, tasks, attachment
   coverage, period status, or tax summary are used only as supporting checks,
   not as substitutes for item-by-item source evidence review
14. confirm any sample or initial scan is explicitly labeled as such and is not
   used to claim the full book, month, supplier, account, or population was
   reviewed
15. confirm the review does not invent materiality thresholds and does not
   waive statutory tax, source-total, bank or card reconciliation, duplicate,
   or closed-period differences as immaterial without explicit user,
   accountant, book-policy, or jurisdiction-workflow support
16. confirm the output includes a readable item-by-item report in the user's
   language that explains each required check and conclusion; JSON is allowed
   only as a supporting artifact, not as the primary user report
17. confirm the structured exception report includes severity, evidence,
   recommendation, auto-fix safety, and confirmation requirement
18. confirm no ledger mutation occurs unless the user explicitly approves a
   specific official Vibooks correction workflow

Release evidence:

- candidate commit SHA or pending release tag reviewed
- scope reviewed
- review type and denominator
- coverage totals by status
- original evidence used
- ledger read surface used
- prohibited artifacts avoided
- professional bookkeeping criteria used
- script-assisted source fields and visual-confirmation status
- materiality or rounding thresholds used, if any, and their documented source
- whether sampling was used and, if so, whether the result avoided full-scope
  claims
- whether the user-facing report gave item-by-item readable results in the
  user's language
- exceptions found, or pass notes if none were found
- whether any proposed correction used an official Vibooks workflow

## Scenario 7: Jurisdiction-Sensitive Statement Evidence

Goal: prove the skill treats bank and card statements as evidence of observable
account movement without using that provenance as blanket proof of business
purpose, recognition date, deductibility, or commodity-tax entitlement.

Use the statement-evidence prompts in:

- `jurisdiction-walkthrough-prompts.md`

Exercise at least these patterns:

- Canada: an ordinary monthly corporate credit-card statement supports payment,
  but a missing supplier receipt, invoice, other qualifying documentation, or
  documented CRA-authorized procurement-card exception prevents a GST/HST input
  tax credit from being marked supported
- United States: a financial account statement supports payment only when it
  contains the payment-method-specific facts required by IRS guidance—check
  number, amount, payee, and posted date for a check; amount, payee, and posted
  date for an EFT; or amount, payee, and transaction date for a credit card—but
  proof of payment alone does not establish a deductible business expense
- uncovered jurisdiction: statement support remains limited to observable
  account movement while official local rules are researched before any
  deduction, VAT/GST, or local-compliance conclusion
- cross-period cutoff: an individual line has a December 31 transaction date,
  a January 2 posting date, and a January 31 statement closing date; the closing
  date is not used as payment, receipt, or recognition timing, and any choice
  between the per-line dates follows the accounting basis, payment method, book
  policy, and jurisdiction rules
- unclassified genuine movement: a real statement-account movement with no
  supported offset classification is not guessed or erased; reconciliation
  stays blocked unless the owner or accountant explicitly approves a temporary
  suspense entry with no tax claim and a visible unresolved-evidence exception

Check:

1. confirm the response records statement provenance as
   `statement_supported` without treating it as an item-level pass
2. confirm the response separately concludes
   `payment_or_receipt_supported`, `business_nature_supported`,
   `recognition_date_supported`, and `tax_documentation_supported`; does not
   pass payment or receipt merely because account movement is visible; and
   applies payment-method and jurisdiction requirements
3. confirm the response distinguishes the individual line's transaction date,
   posting date, matching-oriented `statement_date`, and statement period-end
   date; retains both per-line source dates when supplied; never uses the
   period-end date merely because it labels the statement; and does not silently
   substitute cash-basis payment timing for accrual-basis recognition or cutoff
4. confirm owner or accountant explanation may support classification but does
   not replace a locally required invoice, receipt, prescribed tax document, or
   other source record
5. confirm bank-originated fees, interest, or clearly evidenced own-account
   transfers may rely primarily on statement evidence only when that evidence
   establishes the full bookkeeping treatment and the jurisdiction does not
   require more; the response does not invent a deduction or tax claim
6. for Canada, confirm an ordinary monthly credit-card statement alone does not
   support a GST/HST input tax credit when it lacks prescribed information and
   no documented CRA-authorized exception applies
7. for the United States, confirm proof of payment alone does not establish
   entitlement to a business-expense deduction and each payment method requires
   the correct statement fields and date type
8. for an uncovered jurisdiction, confirm the response uses current official
   sources and remains `needs_user` or `unknown` until the material local rule
   is confirmed
9. when a genuine movement lacks supported classification, confirm the response
   keeps the line `unmatched` and reconciliation and period close blocked or,
   with explicit approval, records the statement-account movement against
   suspense with no tax claim while keeping the unresolved evidence conclusions
   visible

Release evidence:

- candidate commit SHA or pending release tag reviewed
- jurisdiction profile exercised
- statement evidence reviewed
- per-line transaction date, posting date, and statement period-end date
- cross-period cutoff result
- four evidence conclusions and their statuses
- accounting basis used
- official authority consulted when required
- missing source documents or prescribed fields
- whether any deduction or commodity-tax conclusion remained unresolved
- suspense entry used or reconciliation kept blocked for an unclassified movement

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
public repo. Use `release-evidence-template.md` as the public checklist source,
then copy it into the private record for the current candidate.
