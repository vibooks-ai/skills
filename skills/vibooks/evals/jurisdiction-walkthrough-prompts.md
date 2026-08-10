# Jurisdiction Walkthrough Prompts

Use these prompts for manual behavior walkthroughs when validating
jurisdiction-profile routing and stop conditions.

Run each prompt against a client or model that can use the `vibooks` skill.
Evaluate the response against the expected behavior checklist below the prompt.

These prompts are for behavior review, not trigger-only review.

When the walkthrough starts from `https://vibooks.ai/skill.md`, the expected
first step is to run `npx skills add vibooks-ai/skills --skill vibooks -g` and
switch into installed-skill mode only if the client picks up new skills live;
otherwise keep using the web copy for the current walkthrough and expect the
installed local skill on the next start.

## Canada SMB

Prompt:

```text
Use Vibooks to bootstrap a new bookkeeping-ready book for a Canadian private
company that runs a small consulting business in Nova Scotia. Keep the setup
conservative, use the right reporting-basis default unless I clearly need IFRS,
and do not treat CRA GIFI as the live chart of accounts. If province-specific
tax setup needs more information, stop and ask instead of guessing.
```

Expected behavior:

- routes to `ca_smb`
- keeps jurisdiction and industry separate
- defaults toward `ASPE`, not `IFRS`
- does not propose CRA GIFI as the operating chart
- uses Canada-oriented tax and account guidance conservatively
- stops and asks if province-specific tax setup is still materially unclear

## United States SMB

Prompt:

```text
Use Vibooks to set up a bookkeeping-ready book for a U.S. small retail
business. Keep jurisdiction and industry separate. Do not invent state sales
tax setup until the actual state and registration context are clear, and do
not model U.S. sales tax as one national federal tax.
```

Expected behavior:

- routes to `us_smb`
- keeps jurisdiction and industry separate
- does not create one national U.S. sales-tax code
- treats ordinary sales tax as a state or local issue
- stops and asks before configuring sales-tax master data if the state is
  unknown
- does not mix payroll tax and sales-tax liabilities together

## Japan SMB

Prompt:

```text
Use Vibooks to set up a bookkeeping-ready book for a Japanese small company.
Keep jurisdiction and industry separate. Use Japanese consumption-tax
bookkeeping defaults only if registration status is clear, preserve qualified
invoice evidence issues for tax accountant review, and do not claim Vibooks
files Japanese tax returns.
```

Expected behavior:

- routes to `jp_smb`
- keeps jurisdiction and industry separate
- treats JPY as the ordinary operating currency unless the saved setup says
  otherwise
- creates or recommends Japan consumption-tax master data only when the book is
  registered or the accountant explicitly wants tax-coded management books
- treats qualified invoice registration and per-rate tax summaries as evidence
  review items
- uses `tax_claimable_ratio` for partial input-tax credit instead of cloning
  supplier-specific tax codes
- does not imply Vibooks files Japanese corporation tax or consumption-tax
  returns

## Statement-Evidence Review

### Canada

Prompt:

```text
Use Vibooks to review a Canadian corporate credit-card charge using only the
monthly card statement. The statement clearly shows the amount, merchant, and
date, but the supplier receipt or invoice is missing. Separate what the
statement proves from the business-purpose, recognition-date, and GST/HST
documentary checks. Do not assume the input tax credit is supported.
```

Expected behavior:

- routes to `ca_smb`
- records the observable payment facts as `statement_supported`
- keeps `payment_or_receipt_supported`, `business_nature_supported`,
  `recognition_date_supported`, and `tax_documentation_supported` separate
- does not mark the ordinary monthly statement alone as sufficient GST/HST
  input-tax-credit documentation when it lacks prescribed information and no
  documented CRA-authorized exception applies
- allows an owner explanation to support classification without treating it as
  a substitute for prescribed GST/HST documentation

### United States

Prompt:

```text
Use Vibooks to review three U.S. small-business payments shown on legible
financial account statements but supported by no invoice or receipt: a check
line showing check number, amount, payee, and the date the bank posted it; an
EFT line showing amount, payee, and the date the bank posted the transfer; and a
credit-card line showing amount, payee, transaction date, and a later posting
date. Separate proof of payment from proof that each cost was incurred for a
deductible business purpose, and respect the book's cash or accrual basis.
```

Expected behavior:

- routes to `us_smb`
- applies the check, EFT, and credit-card statement-field requirements
  separately, including the correct posted or transaction date for each method
- treats each qualifying statement record as payment evidence without turning
  it into a blanket deduction conclusion
- keeps the business-purpose and recognition-date checks unresolved when the
  remaining evidence does not support them
- does not substitute either per-line statement date for accrual recognition or
  cutoff, and never treats the statement closing date as the transaction date

### Statement-Primary Exceptions

Prompt:

```text
Use Vibooks to review a bank-originated monthly account fee and a transfer
between two accounts owned by the same business. Both movements are clearly
identified on legible statements, the transfer amount and dates agree across
the two accounts, and no jurisdiction-specific rule requires another source
record. Decide whether statement evidence supports the full bookkeeping
treatment without turning either item into a deduction or tax claim.
```

Expected behavior:

- records the observable statement facts as `statement_supported`
- allows the bank-originated fee and clearly evidenced own-account transfer to
  rely primarily on statement evidence because that evidence establishes their
  full bookkeeping treatment and no applicable rule requires more
- records the fee as a bank charge and the transfer as an own-account transfer;
  does not invent a supplier purchase, revenue, expense for the transfer, or a
  commodity-tax claim
- keeps any conclusion unresolved if account ownership, counterpart movement,
  amount, date, or a material jurisdictional requirement is not supported

### Uncovered Jurisdiction

Prompt:

```text
Review a statement-only business expense for a country that has no dedicated
Vibooks jurisdiction profile. Record what the bank statement proves, then use
current official local sources before deciding whether the evidence supports a
deduction or VAT/GST claim. If the local rule is not clear, keep the result
unresolved.
```

Expected behavior:

- routes to `generic_global`
- limits statement support to observable account movement and reconciliation
- researches government, regulator, or official standards sources before a
  local tax or documentary conclusion
- returns `needs_user` or `unknown` instead of claiming local compliance when
  the evidence rule remains unclear

### Cross-Period Date Boundary

Prompt:

```text
Use Vibooks to review a statement line with a December 31 transaction date, a
January 2 posting date, and a January 31 statement closing date. Explain the
timing result for cash-basis and accrual-basis books. Apply the book policy,
payment method, and jurisdiction rules when deciding which per-line date
supports cash timing, and do not assume the statement closing date is the
payment, receipt, or recognition date.
```

Expected behavior:

- identifies the transaction date, posting date, and statement closing date as
  three distinct facts
- uses January 2 as Vibooks' matching-oriented `statement_date`, while retaining
  December 31 in the original evidence and the bank-line `reference` or `note`
- never uses January 31 as the payment, receipt, or recognition date merely
  because it is the statement period end
- selects between the per-line dates for cash-basis timing only when the book
  policy, payment method, and jurisdiction rules support that conclusion;
  otherwise keeps the timing conclusion unresolved
- uses the applicable invoice, supply, service, delivery, or other recognition
  evidence for accrual-basis cutoff instead of substituting either statement-
  line date

### Genuine Movement With Unresolved Classification

Prompt:

```text
Use Vibooks to review a genuine bank-statement outflow whose account, amount,
payee, and posting date are clear but whose business purpose, offset account,
recognition date, and tax treatment are not supported. Explain how to preserve
the bank movement without guessing an expense or tax claim, and state what
happens when the owner has or has not approved temporary suspense treatment.
```

Expected behavior:

- does not invent an expense, deduction, or tax claim from the bank memo
- without explicit owner or accountant approval, keeps the line `unmatched` so
  reconciliation and period close remain blocked; does not use
  `reviewed_exception` for the unrecorded movement
- with explicit approval, records only the supported statement-account movement
  against a dedicated suspense or clearing balance, claims no tax, retains the
  source dates and review note, and auto-matches the line
- keeps business-nature, recognition-date, and tax-documentation conclusions
  unresolved until the suspense balance is properly reclassified

## Uncovered Jurisdiction

Prompt:

```text
Use Vibooks for a small business in a country that does not yet have a
documented jurisdiction profile in the skill. Before creating tax codes or tax
control accounts, look up the current official local rules. If the country or
subnational rules are still unclear, stop and ask instead of guessing.
```

Expected behavior:

- routes to `generic_global`
- explicitly says it must research official country rules first
- prioritizes government or regulator sources over blog content
- uses standards-body or professional guidance second
- treats mainstream software docs only as UX alignment support
- stops and asks if the local rule remains unclear after research

## Review Notes

Record at least:

- candidate commit SHA or pending release tag reviewed
- model or client used
- skill revision reviewed
- prompt exercised
- chosen jurisdiction profile
- whether official research was used correctly
- whether the stop boundary was honored
- any drift between expected and actual behavior
