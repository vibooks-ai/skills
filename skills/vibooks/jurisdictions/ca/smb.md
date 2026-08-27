# Canada SMB Jurisdiction Profile

Profile id: `ca_smb`

Status: `skill_guided`

Scope: ordinary Canadian private-enterprise and small-business bookkeeping on
the current shipped Vibooks product. This profile is not a full handbook or tax
advice substitute.

## Use This Profile When

- the book or company `country` is Canada
- the source documents, tax registration, or user instructions clearly show the
  business keeps its books under Canadian business rules
- the business is an ordinary small business or private enterprise rather than
  a public issuer, pension plan, or specialized regulated reporting entity

Do not choose this profile merely because the operator is Canadian.

## Authority Order

Use these sources in order:

1. explicit Vibooks book or company setup already saved
2. real tax registrations and the actual operating province or territory
3. source documents and business profile details
4. explicit user instruction
5. current device country only as a last-resort bootstrap suggestion

If Canada is clear but the province or territory matters for tax setup and is
still unknown, stop and ask before creating province-specific tax codes.

## Reporting-Basis Default

Default to `ASPE` for ordinary Canadian private-enterprise books.

Use `IFRS` only when one of these is clearly true:

- the user explicitly requests IFRS
- the entity is publicly accountable or preparing IFRS financial statements
- a lender, investor, owner, or regulator explicitly requires IFRS

Stop and ask before proceeding if the book appears to be for:

- a not-for-profit organization that may need Part III guidance
- a pension plan
- a publicly accountable enterprise
- a specialized sector with external reporting requirements outside ordinary
  small-business bookkeeping

## Evidence Sufficiency And Statement Rules

For ordinary Canadian small-business books, treat bank and card statements as
source records that support observable account movement and reconciliation.
Keep them with the book, but do not treat a statement or cancelled cheque as
blanket proof of the underlying business expense, income source, accounting
classification, or GST/HST treatment.

Rules:

- for ordinary business income and expense support, retain the available sales
  invoice, purchase invoice, receipt, agreement, contract, deposit slip,
  cancelled cheque, or other voucher that establishes the source and nature of
  the transaction; a bank statement may be one part of that evidence bundle
- if a supplier did not provide a receipt, do not invent one; obtain and record
  the supplier name and address, amount, payment date, and transaction details
  in the expense record or journal as permitted by current CRA guidance, and
  keep the missing-document limitation visible for review
- for a GST/HST input tax credit, mark `tax_documentation_supported` as `pass`
  only when the available invoice, receipt, agreement, or other prescribed
  documentation contains the information required for the claim
- an ordinary monthly credit-card statement that lacks the prescribed supplier
  and tax information is not sufficient documentary evidence for a GST/HST
  input tax credit; require a supporting receipt, invoice, or other qualifying
  documentation before treating the claim as supported
- do not apply that ordinary-statement rule to a documented exception merely by
  analogy: if the registrant relies on the CRA procurement-card policy or
  another documentary exemption, confirm and retain the current authorization,
  required controls, qualifying transaction scope, and issuer-report fields
  before treating the exception as supported
- an owner or accountant explanation may help classify a transaction, but it
  does not replace the documentary information required for a GST/HST claim
- for cash-basis reporting where it is actually applicable, statement evidence
  may support when an amount was paid or received; for ASPE or another
  accrual-basis book, use the underlying supply, invoice, service, or delivery
  evidence for recognition and cutoff instead of substituting the bank date

If the source supports payment but not business nature, recognition date, or
GST/HST entitlement, keep those checks `warning`, `fail`, `needs_user`, or
`unknown` as appropriate rather than passing the item from statement evidence
alone.

## Current-Product Routing

On the current shipped product, use the official jurisdiction-profile path for
Canada first, then keep the remaining chart and workflow choices conservative.
Use this routing:

1. create the company with `country = CA`; when known, also save the true
   province or territory and `commodity_tax_registration_status` there so new
   books inherit the same defaults
2. set or confirm `jurisdiction_profile_id = ca_smb`, the true province or
   territory, and `commodity_tax_registration_status` through the product
   create/apply flow when those facts are known and the operator explicitly
   wants the Canada profile applied
3. set the true operating currency, usually `CAD`
4. apply the nearest official Vibooks industry preset when one matches the
   business
5. review the chart of accounts and add only the Canadian statutory or common
   balances the book truly needs
6. configure tax codes only when the business is actually registered or the
   user explicitly wants tax-coded bookkeeping

Current official product path:

- set the fields at book creation when they are already known
- otherwise call `post-v1-books-book-id-jurisdiction-profile-apply`

Do not claim that Vibooks has a built-in CRA filing integration or a complete
Canadian chart package unless the shipped product actually exposes one.

## Canadian Payroll And Vacation-Pay Bookkeeping

For supported Canadian payroll dates, treat statutory payroll and vacation pay
as effective-dated, server-selected bookkeeping workflows. Never extend a prior
rule release because the next interval appears unchanged. If Vibooks reports a
missing official release, unresolved coverage, incomplete service history, an
unsupported employee class, or an unknown earning meaning, stop rather than
guessing.

Canadian pay statements are part of the posted payroll record, not a separate
document-import or POS workflow. Before activation, use setup readiness to
confirm one pay-date-effective employer payroll identity, each employee's sole
payroll identity and employee code, and an explicit employment-standards
jurisdiction. Tax province and employment-standards jurisdiction are separate;
never infer federal coverage from the business industry or tax province.

For an ordinary supported pay period:

1. read `/v1/books/{book_id}/payroll-rule-readiness`; Vibooks runs this check
   automatically when Payroll opens and before calculation, batch creation, or
   posting. If a headless workflow observes `pending`, POST the same resource to
   run the system-owned check; this is not a request for the user or Agent to
   certify statutory rules. Stop ordinary posting on `blocked`, correct every
   affected historical payroll through the statutory reverse/replace workflow,
   then run the check again. Never ask Vibooks to use an older revision. Posted
   payroll keeps the exact revision originally used, while the payroll pay date
   selects the applicable legal interval regardless of the current or activation date
2. create the employer identity and employee statement profile through their
   first-class APIs, then activate pay statements only when setup readiness is
   complete
3. treat a saved default-hours value only as a proposal; confirm the exact
   current-period paid, worked and payment hours from a timesheet, employer
   record, employee record or explicit operator confirmation
4. pass the typed `pay_statement_facts` through calculation preview and carry
   the server-returned draft and fingerprint unchanged into run or batch post
   (`salary_hours_worked` is supplied only for a salary profile; earning meaning
   always comes from the server's versioned payroll item and is never caller-set)
5. after post, read the statement through its payroll-run link or list API;
   render the retained PDF/HTML or export the batch ZIP without marking it as
   delivered
6. for every supported Canadian jurisdiction, read the statement's
   server-derived `paper_handoff` projection before acting; `not_recorded` means
   only that no current paper-delivery fact exists and never means the cash wage
   is unpaid
7. record `paper_in_person` only after the real paper handoff, binding the exact
   retained language artifact and a handoff timestamp no later than server time;
   optionally retain an employee-acknowledgement reference, source reference and
   note, but do not infer payment, timeliness, compliance qualification or
   recipient confirmation from any of them
8. correct a mistaken current handoff through preview/commit correction so the
   original fact remains and a void or replacement successor is appended; an
   active handoff or replacement may be replaced or withdrawn, while an active
   withdrawal may only be restored with replacement facts and imported legacy
   history is read-only
9. after any handoff write, re-read list, detail and owning-run views and require
   their `paper_handoff` status, active count, last handoff and correction-history
   flag to agree
10. use payroll reversal/replacement for payroll corrections; send the complete
   current statement facts and calculation fingerprint, and never edit a
   statement or regenerate historical content from current templates or rules

Treat Payroll work surfaced by `/v1/books/{book_id}/tasks` as a versioned
server projection, not as a durable client-side checklist. Payroll task IDs
contain an opaque instance token; preserve the complete ID, re-read
`/v1/books/{book_id}/tasks/{task_id}` immediately before acting, and follow only
the returned `actions[].target` for Review, Fix, or Correct payroll. Do not
construct an action from the task title, family name, or a cached count. A
`missing_scopes` action must remain unavailable. If the detail read returns
`TASK_INSTANCE_CHANGED`, discard the old ID and present the current task; if it
returns `TASK_VERIFICATION_REQUIRED`, run or complete the retained rule-impact
check before continuing; if the task is no longer found, treat it as resolved
rather than recreating it. These tasks report affected-item counts and must
never be converted into invented monetary exposure.

Before reversing or replacing a certified employment-standard payroll run,
create a statutory correction plan for that run and the exact reversal or
replacement pay date. Read its transitive dependency graph and stop on every
returned blocker, including a closed or unavailable accounting period, a
prepared or paid remittance, a later payroll consumer, or missing retained
evidence. Carry the unchanged plan ID and graph fingerprint into the action,
whose date must still match the reviewed plan. If the server reports that the
plan is stale, discard it, read the new graph, and obtain a fresh review; never
retry with an old fingerprint or mutate individual dependent rows by hand.

When the mistake is in a protected upstream source rather than the payroll
result, use the same statutory correction planner with exactly one typed
replacement for the original weekly work-fact generation, prior-provider
opening-earning generation, or reviewed tip-collection event. Review the plan's
exact source-rooted dependency graph, replacement summary, accounting-period
checks, and `entry_reverse_approval_targets`. On standard or strict approval
books, create the listed `entry.reverse` approvals with the exact returned
payloads and pass their IDs to `:execute`. Execution must receive the unchanged
plan ID and graph fingerprint; it atomically reverses every dependent result,
appends the source successor, and posts the verified payroll successors. A stale
graph, prepared or paid remittance, closed period, missing approval, changed
calculation, or failed successor blocks and rolls back the entire operation.

For the certified PEI `general-hourly-v1` operation, use only the server-derived
weekly period aligned to the effective employer work-week policy. Retain one
reviewed fact for every date and every physical report-to-work occurrence; do
not infer attendance from scheduled hours. Every occurrence must state whether
physical attendance was required, whether the employee attended or was a
documented no-show, and, when attended, the full local arrival date and time.
A documented no-show carries zero worked/paid hours and does not create
reporting pay. Do not submit a legal eligibility result, overtime threshold, minimum rate,
holiday date, holiday amount, tip tax class, or pay date. The server derives
those results from the bounded PEI employment-standard package. Carry the
returned draft and fingerprint unchanged. Certified PEI posting requires an
effective PEI vacation profile in `accrue_for_later` mode and matching vacation
accounts; the wage journal, vacation accrual, vacation subledger event and pay
statement post in one transaction. If a rule interval, external applicability
determination, complete week, daily facts, prior holiday basis, vacation setup,
or compatible statement/CRA/vacation package is missing, stop without posting.

The first PEI operation supports initial, unchanged or increased hourly rates
only. It blocks rate reductions, transition weeks, non-weekly/non-aligned
periods, unsupported employee classes, holiday/overtime/reporting-pay
interactions, and any caller attempt to extend a rule after its explicit end.
After a vacation-bearing payroll post, reverse its owning vacation calculation
before reversing payroll so both subledgers remain reconciled.

For employer-collected PEI tips, never use a generic liability balance or a
free-text account as the payroll source. First create
`payroll-tip-collections` from a retained, reviewed processor or sales summary:
post the gross employee-owned principal to the exact current-liability Tips
Payable account and post processor fees separately. A controlled-tip or direct
card-conduit payroll preview must select that source ID and cannot allocate more
than its remaining principal. The server derives CRA treatment, custody
settlement and the PEI property deadline. A card-conduit assertion additionally
requires the retained CRA payout-timing fact supported by the current official
package; a weekly-payroll or unspecified timing assertion does not qualify as
CRA-direct. A payout after the PEI deadline may still be recorded so the
employee receives the money, but the server creates a durable blocking payroll
compliance issue. Acknowledge that issue only to record review, and resolve it
only with a real corrective-action note; neither action rewrites the posted
payroll evidence. Reverse an unused mistaken source through its `:reverse`
action; if a posted payroll used it, reverse the dependent payroll first so
source availability is restored.
Direct cash tips never possessed by the employer use a retained record
reference and create no employer cash or Tips Payable entry.

When the first Vibooks week needs the preceding four-week holiday basis, use
`payroll-opening-earnings` only from a retained prior-provider register. Cover
every calendar date with exact supported earning semantics or explicit
`no_earnings`, reconcile all semantic totals, assert the absence of other
earnings and meals/lodging, and attach the source evidence. Do not use aggregate
YTD totals. Correct an unused generation with an exact-interval successor; a
generation already used by posted payroll remains immutable until its dependent
payroll is reversed.

Québec statements default to French. Select English only when an effective
employee request has been retained. The desktop/UI language never chooses the
formal statement language. Vibooks may brand the shared English or French
template, while jurisdiction-specific protected content remains owned by the
effective rule package; do not create one appearance template per province.
When a request is recorded after payroll was posted, use the returned statement
successor IDs. If a future-dated request has since become effective, call the
employee language-companion materialization endpoint before rendering English;
the prior French revision and bytes remain retained.

If Vibooks returns `PAY_STATEMENT_RULE_NOT_PUBLISHED`, missing confirmed facts,
an unsupported earning meaning or incomplete setup, do not post the payroll or
create a manual stub. Retain the evidence, correct setup or use an external
payroll workflow until an exact verified rule interval exists.

Vacation pay is a general employee-liability capability, not a restaurant or
POS feature. Use it for any supported employer that must track money earned,
paid, and still owed to an employee:

1. propose the employee's jurisdiction, general-class status, service start,
   reference year, and policy mode from reviewed business evidence; ask the
   operator to confirm uncertain facts instead of making a legal-coverage claim
2. configure effective-dated Vacation Pay Expense and `Vacation Pay Payable`
   accounts, then create the effective employee policy; BC/ON pay-each policies
   also require the written or electronic agreement record
3. for a Sage or other cutover, analyze employee detail into explicit statutory
   earned, contractual extra, paid, owed, vacationable-wage, and reference-period
   facts; never propose a rule-release ID because Vibooks selects it from the
   employee jurisdiction and cutover date and recalculates the statutory amount;
   for Québec protected-absence history, record the reviewed exact-period
   absence fact set before preview so opening uses the section-74 formula;
   split history at a service-rate boundary when Vibooks asks for dated detail;
   the sum of positive openings must tie to the source control balance, while a
   fully paid pay-each history uses the zero-control history disposition
4. ordinary Canadian payroll outside the certified PEI operation previews each
   vacation earning from exact posted payroll components and dated earning
   semantics inside that payroll run's immutable pay period, using its exact pay
   date, then post only the returned calculation ID; retained mode posts expense/
   payable, while pay-each must bind the exact vacation-pay component already
   present in the posted payroll run; certified PEI payroll creates its retained
   vacation accrual atomically during payroll post and must not be accrued again
5. settle retained vacation only through the vacation-payment workflow, binding
   the exact payroll component that debits `Vacation Pay Payable`; use the source
   payroll run's pay date and never backdate it or allocate a later-earned balance;
   Vibooks owns the oldest-due employee allocation
6. close reference periods so the official whole-period target and any true-up
   are preserved with the exact published rule release, then use the report to
   prove employee owed equals the Vacation Pay Payable general-ledger balance
7. correct history through the owning vacation calculation's reversal using a
   fresh request ID and reviewed approver, then create a new preview with
   `replaces_calculation_id` and post it with another fresh request ID; never
   edit a posted vacation event, allocation, or journal

If a vacation post or reversal returns
`VACATION_STRICT_APPROVAL_UNSUPPORTED`, stop. The initial small-business
vacation workflow does not post while the book requires separate strict
approvals. Do not treat a free-text approver as authority and do not recreate
the vacation entry manually; ask whether the operator wants to use a supported
light/standard approval mode.

AI analysis of Sage reports, payroll registers, employment agreements, or other
source material produces proposed facts and first-class Vibooks calls; it is not
a file-import shortcut and must not bypass the same preview, approval,
reconciliation, and correction controls.

Keep the scope bookkeeping-first. Vibooks records vacation money and the
payable; it does not schedule PTO, approve leave, calculate a restaurant tip
pool, operate a POS, submit government filings, or replace professional legal
advice.

## Chart-Of-Accounts Rules

Rules:

- do not use CRA GIFI as the operating chart of accounts; treat GIFI as a
  mapping or reporting layer, not as the day-to-day ledger structure
- start from the official Vibooks generic or industry preset, then add Canada-
  specific balances only where the business facts require them
- preserve one real account per real bank account, card, loan, tax balance,
  and clearing balance
- prefer current shipped-product-compatible control-account roles over
  inventing local aliases that drift from Vibooks' account semantics

Common Canadian additions that may be appropriate when the business facts
require them include:

- sales tax payable or recoverable balances
- payroll deductions payable
- shareholder loan balances
- industry-specific deposits, gift-card liabilities, or deferred revenue

Do not create these just because they are common in Canada. Create them only
when the real book needs them.

## Tax Control Accounts And Tax Codes

On the current shipped product, keep the control-account roles stable even if a
future localized UI later changes the display labels.

Current shipped-product-compatible default roles:

- payable control account:
  - new-profile default name: `GST/HST Payable`
  - legacy-compatible reused name: `Sales Tax Payable`
  - `report_category`: `tax_payable`
- recoverable control account:
  - new-profile default name: `GST/HST Recoverable`
  - legacy-compatible reused name: `Sales Tax Receivable`
  - `report_category`: `tax_receivable`

Current product behavior for explicit `ca_smb` opt-in:

- `post-v1-books` can save `country`, `region`, `jurisdiction_profile_id`,
  and `commodity_tax_registration_status`, but it does not itself create the
  Canadian tax defaults
- actual tax-control-account and tax-code creation happens only when the
  operator explicitly runs `post-v1-books-book-id-jurisdiction-profile-apply`
- if Vibooks creates the tax control accounts for a new or empty book, it uses
  the localized Canadian names above
- if the book already has compatible generic `Sales Tax Payable` /
  `Sales Tax Receivable` accounts, Vibooks reuses them without forcing a rename

Preserve the account role first and do not force a cosmetic rename over a
correct existing control account.

Tax-code rules:

- create only the real statutory tax codes the book actually needs
- keep ordinary Canadian federal GST as `GST5` with the standard statutory
  name and rate when that is the real regime
- use the real participating-province HST code only when the business truly
  operates or files under that HST regime, for example `HST13`, `HST14`, or
  `HST15` depending on the province and the current CRA rate schedule
- before creating or revising HST codes, confirm the current CRA rate for the
  province instead of assuming an older rate schedule
- do not create synthetic near-duplicate codes such as `HST1501` merely to
  absorb rounding or partial recoverability
- for partial input-tax claimability, keep the statutory tax code and use the
  normal claimability controls on the document line instead of cloning tax code
  master data
- if the business is not yet registered, keep `tax_mode` conservative and do
  not create GST, HST, PST, or QST codes pre-emptively

Quebec, PST, and other province-specific commodity-tax setups can require extra
jurisdiction detail. Stop and ask before creating them when the obligation is
not explicit.

## Accountant Handoff Package

For Canadian books, the accountant handoff is a bookkeeping workpaper package,
not a CRA filing output.

Use `get-v1-books-book-id-accountant-handoff` for the review date range to
prepare the accountant-facing financial statements, trial balance, general
ledger, journal entries, A/R and A/P aging and open items, bank reconciliation
summary, GST/HST summary, evidence review, attachment manifest, and Canada
jurisdiction notes.

Use `post-api-admin-export-accountant-package` when the accountant needs files:

- `format = xlsx` creates the styled Excel workbook intended for accountant
  review
- `format = zip` includes the full Excel workbook, each selected report as an
  independent XLSX workbook, the JSON workpaper payload, and package manifest
  with report filenames that include company, book, date range, and report
  language
- omit `sections` for the default full report pack; pass `sections` only when
  the accountant asks for selected workpapers, so the workbook tabs,
  independent report files, and JSON payload include only those reports
- leave `basis` unset for the normal accrual-basis package; pass `basis = cash`
  or `basis = tax` only when the accountant explicitly requests that basis for
  the Profit and Loss and Balance Sheet sections
- in the desktop app, use `Reports > Accountant Package`; choose `Full fiscal
  year` for year-end handoff or `Fiscal year to date` for interim review, then
  leave all workpapers selected or clear reports the accountant did not request

Do not claim that the package files a GST/HST return, T2, T1 business schedule,
payroll return, or other CRA filing.

## Suggested Optional Accounts

When the product applies `ca_smb`, it may also surface optional chart
recommendations instead of auto-creating them.

Common high-signal suggestions include:

- `2210 Payroll Deductions Payable`
- `2400 Shareholder Loan`

Treat these as operator-reviewed suggestions, not mandatory defaults. Create
them only when the real business facts require them.

## Account Numbering Guidance

Account numbering is recommended, not mandatory.

Use a stable Canadian-style numbering range when the book wants numbered
accounts, but do not renumber an existing clean chart solely to match a
template. A practical small-business default is:

- `1000-1999`: assets
- `2000-2999`: liabilities
- `3000-3999`: equity
- `4000-4999`: revenue
- `5000-5999`: cost of sales or direct costs
- `6000-7999`: operating expenses
- `8000-8999`: other income and other expense

Prefer stable numbers that match the current book structure over performative
re-numbering.

## Units Of Measure

Canada may require metric and non-metric units to coexist in practice. If the
book uses item quantities or inventory-style units:

- keep one base unit plus any related purchase, sales, or shipping units
- record the true unit used by the source documents and operations
- define explicit conversions instead of freehand mental conversion
- do not assume that every Canadian business uses metric-only units
- do not rename an existing base unit into a different physical unit once
  transactions rely on it; create a new unit set instead

## Do Not Do

- do not choose this profile from operator nationality alone
- do not treat CRA GIFI codes as the live operating account list
- do not mix jurisdiction rules into industry preset ids
- do not create province-specific tax codes without the actual province or
  territory context
- do not create cosmetic near-duplicate tax codes or control accounts
- do not imply that current shipped Vibooks automatically files Canadian tax
  returns unless the product actually exposes that first-class workflow

## Future Product Mapping

When Vibooks later ships deeper first-class Canada localization beyond the
current jurisdiction-profile routing, keep this profile id and prefer the
official product setup. The skill should then switch from manual guidance to:

1. choosing the official `ca_smb` or equivalent product-native setup
2. reusing the product's official Canadian chart and tax defaults
3. keeping this document as a safety and interpretation layer, not as the
   primary creator of Canadian master data

## Reference Points

- CRA IFRS and taxable-income guidance:
  [canada.ca IFRS](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/international-financial-reporting-standards-ifrs.html)
  and
  [CRA taxable income](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/international-financial-reporting-standards-ifrs/impact-ifrs-on-taxable-income.html)
- CRA GIFI reporting guidance:
  [CRA GIFI](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/corporations/corporation-income-tax-return/completing-your-corporation-income-tax-t2-return/general-index-financial-information-gifi/preparing-your-financial-statements-using-gifi.html)
- CRA GST/HST rates and place-of-supply rules:
  [CRA GST/HST rates](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-place-supply.html)
- CRA business-record and expense-documentation guidance:
  [CRA business records](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/sole-proprietorships-partnerships/business-records.html),
  [CRA business expenses](https://www.canada.ca/en/revenue-agency/services/tax/businesses/small-businesses-self-employed-income/business-income-tax-reporting/business-expenses/what-business-expenses.html),
  and
  [current Input Tax Credit Information (GST/HST) Regulations](https://laws-lois.justice.gc.ca/eng/regulations/SOR-91-45/section-3.html),
  [CRA input tax credits](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/calculate-prepare-report/input-tax-credit.html),
  and
  [CRA procurement-card policy](https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/notice199/procurement-cards-documentary-requirements-claiming-input-tax-credits.html)
- Canadian reporting-framework overview:
  [BDC IFRS and Canadian GAAP overview](https://www.bdc.ca/en/articles-tools/entrepreneur-toolkit/templates-business-guides/glossary/international-financial-reporting-standards)
  and
  [FRAS Canada consultation paper](https://www.frascanada.ca/-/media/frascanada/aspe/documents/acsb-cp-exploring-scalability-canada-2023.pdf)
- Canadian measurement-law basis:
  [Weights and Measures Act](https://laws-lois.justice.gc.ca/eng/acts/W-6/page-7.html)
- mainstream Canadian SMB software alignment:
  [QuickBooks Canada sales tax setup](https://quickbooks.intuit.com/learn-support/en-ca/help-article/sales-taxes/set-collect-sales-tax-quickbooks-online/L1Nu6wYj7_CA_en_CA)
  and
  [QuickBooks Canada account numbers](https://quickbooks.intuit.com/learn-support/en-ca/help-article/chart-accounts/use-account-numbers-chart-accounts-quickbooks/L7lRLN0Do_CA_en_CA)
