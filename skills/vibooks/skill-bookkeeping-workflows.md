# Bookkeeping Workflows

## Contents

- Discover the API first
- Bootstrap a new book
- Cleanly rebuild a book
- Hard accounting rules
- Resource-creation defaults
- Chart-of-accounts rules
- Date rules
- Prefer first-class workflows
- Recurring bookkeeping
- Common posting patterns
- Opening balances

## Discover The API First

Before mutating unfamiliar data, inspect the available operations:

```bash
vibooks-cli doctor --json
vibooks-cli ops --search invoice
vibooks-cli describe post-v1-books-book-id-invoices
vibooks-cli schema InvoiceCreateRequest
```

Useful operations include:

- `post-v1-companies`
- `post-v1-books`
- `post-v1-books-book-id-replace`
- `post-v1-books-book-id-policies`
- `post-v1-books-book-id-fiscal-years`
- `get-v1-book-presets`
- `post-v1-books-book-id-presets-apply`
- `get-v1-books-book-id-periods`
- `post-v1-books-book-id-accounts`
- `post-v1-books-book-id-customers`
- `post-v1-books-book-id-vendors`
- `post-v1-books-book-id-items`
- `post-v1-books-book-id-attachments`
- `get-v1-books-book-id-attachments`
- `post-v1-books-book-id-opening-balances`
- `post-v1-books-book-id-invoices`
- `post-v1-books-book-id-invoices-invoice-id-add-attachments`
- `post-v1-books-book-id-invoices-invoice-id-remove-attachments`
- `post-v1-books-book-id-invoices-invoice-id-replace-tax-code`
- `post-v1-books-book-id-sales-receipts`
- `post-v1-books-book-id-sales-receipts-sales-receipt-id-add-attachments`
- `post-v1-books-book-id-sales-receipts-sales-receipt-id-remove-attachments`
- `post-v1-books-book-id-customer-refunds`
- `post-v1-books-book-id-customer-refunds-customer-refund-id-add-attachments`
- `post-v1-books-book-id-customer-refunds-customer-refund-id-remove-attachments`
- `post-v1-books-book-id-bills`
- `post-v1-books-book-id-bills-bill-id-add-attachments`
- `post-v1-books-book-id-bills-bill-id-remove-attachments`
- `post-v1-books-book-id-bills-bill-id-replace-tax-code`
- `post-v1-books-book-id-purchase-receipts`
- `post-v1-books-book-id-expenses`
- `post-v1-books-book-id-expenses-expense-id-add-attachments`
- `post-v1-books-book-id-expenses-expense-id-remove-attachments`
- `post-v1-books-book-id-vendor-refunds`
- `post-v1-books-book-id-vendor-refunds-vendor-refund-id-add-attachments`
- `post-v1-books-book-id-vendor-refunds-vendor-refund-id-remove-attachments`
- `post-v1-books-book-id-receipts`
- `post-v1-books-book-id-receipts-receipt-id-add-attachments`
- `post-v1-books-book-id-receipts-receipt-id-remove-attachments`
- `post-v1-books-book-id-receipts-receipt-id-apply`
- `post-v1-books-book-id-receipts-receipt-id-create-recognition-schedule`
- `post-v1-books-book-id-payments`
- `post-v1-books-book-id-payments-payment-id-add-attachments`
- `post-v1-books-book-id-payments-payment-id-remove-attachments`
- `post-v1-books-book-id-payments-payment-id-apply`
- `post-v1-books-book-id-payments-payment-id-create-recognition-schedule`
- `post-v1-books-book-id-entries`
- `post-v1-books-book-id-entries-entry-id-add-attachments`
- `post-v1-books-book-id-entries-entry-id-remove-attachments`
- `post-v1-books-book-id-recognition-schedules`
- `post-v1-books-book-id-recognition-schedules-schedule-id-cancel`
- `post-v1-books-book-id-recognition-schedules-schedule-id-post-due`
- `post-v1-books-book-id-recognition-schedules-schedule-id-reverse-latest`
- `post-v1-books-book-id-recurring-templates`
- `post-v1-books-book-id-recurring-templates-run-due`
- `get-v1-books-book-id-document-templates`
- `post-v1-books-book-id-document-templates`
- `patch-v1-books-book-id-document-templates-template-id`
- `delete-v1-books-book-id-document-templates-template-id`
- `post-v1-books-book-id-document-templates-template-id-set-default`
- `post-v1-books-book-id-document-templates-template-id-reset`
- `post-v1-books-book-id-documents-document-type-document-id-render`
- `post-v1-books-book-id-bank-lines`
- `post-v1-books-book-id-bank-lines-line-id-create-processor-settlement`
- `post-v1-books-book-id-settlements`
- `post-v1-books-book-id-settlements-settlement-id-reverse`
- `post-v1-books-book-id-settlements-settlement-id-replace`
- `post-v1-books-book-id-reconciliations`
- report operations under `get-v1-books-book-id-reports-*`

When you already know a Vibooks resource id, fetch it with the matching detail
`GET` operation instead of listing the collection and filtering client-side.
Use collection `GET` for search, browse, and pagination; use detail `GET` as
the authoritative read path for one known resource.

## Bootstrap A New Book

Run setup in this order:

1. create the company
2. create the book
3. create the accounting policy
4. create the fiscal year
5. confirm the active period is open
6. choose and apply an official Vibooks preset when it matches the business
7. create or review the chart of accounts
8. create customers and vendors when needed
9. load opening balances if migrating from prior books
10. start routine posting only after the opening balances tie out

Bootstrap defaults:

- infer the first book name from the owner or business profile when it is clear
- if no user-profile detail helps name the book, use `Primary Book`
- infer company `country` and base currency from the owner or business profile
  when the profile is clear
- if the user profile does not make `country` or base currency clear, use the
  current device country and its normal operating currency
- treat that base currency as Vibooks `functional_currency`, and keep
  `presentation_currency` the same unless the user explicitly wants something
  different
- when the business shape is clear, inspect `get-v1-book-presets` and use the
  nearest official preset:
  `generic_smb` for most service businesses, `ecommerce_platform` for
  marketplace or channel-heavy sellers, `restaurant_summary` for summary-based
  restaurant books, and `lodging_summary` for Airbnb, short-term rental, or
  small lodging books
- treat `get-v1-book-presets` as the authority for preset availability; if the
  catalog marks a preset unavailable, do not try to force it through another
  surface
- `ecommerce_platform`, `restaurant_summary`, and `lodging_summary` require the
  Industry Presets entitlement because they rely on official industry-specific
  defaults
- `restaurant_summary` and `lodging_summary` are summary-based post-facto
  bookkeeping presets; they do not mean Vibooks replaces a POS, PMS, or other
  front-office operating system

Preferred setup command:

```bash
vibooks-cli books bootstrap \
  --company-name "COMPANY NAME" \
  --book-name "Primary Book" \
  --fiscal-year-start 2026-01-01 \
  --fiscal-year-end 2026-12-31 \
  --currency USD \
  --tax-mode none
```

After bootstrap:

1. verify the created company, book, policy, and fiscal year
2. review or add the chart of accounts before posting
3. load opening balances only after confirming the cutover trial balance

## Cleanly Rebuild A Book

If a book must be rebuilt from a clean baseline but it already contains
accounting history, do not hard-delete it resource by resource.

- use `post-v1-books-book-id-replace` to archive the current book and create a
  clean replacement under the same company
- prefer this flow in single-book environments when the current total book
  limit still has room for the archived source plus the new replacement
- provide the replacement `code` and `name`
- Vibooks copies the latest accounting policy and latest fiscal year by default
  when they exist; review the copied setup before posting
- after replacement, continue migration work in the new book and keep the
  archived source as read-only history

Example:

```bash
vibooks-cli invoke post-v1-books-book-id-replace \
  --path bookId=BOOK_ID \
  --body '{"code":"PRIMARY-REBUILD","name":"PRIMARY BOOK"}'
```

Recommended defaults for a normal small business:

- `accounting_basis`: `accrual`
- `functional_currency`: the true operating currency of the business
- `presentation_currency`: usually the same as `functional_currency`
- `scale`: `2`
- `rounding_mode`: `half_up`
- `year_close_mode`: `closing_entries`
- `tax_mode`: `none` unless the user explicitly wants tax-coded bookkeeping

When tax registration or tax handling changes later:

- create a new accounting policy version with
  `post-v1-books-book-id-policies`
- set `effective_from` to the real tax change date
- set the new `tax_mode` for that date and later
- when the new policy omits `effective_to`, Vibooks automatically ends the
  previously effective policy on the prior day
- do not leave overlapping policy ranges in place

## Hard Accounting Rules

- use first-class business-document workflows before manual journals
- use recurring templates for predictable repeats instead of cloning prior-period
  invoices, bills, or journals by hand
- post from evidence, not guesses
- never net receivables, payables, taxes, or clearing balances against revenue
  or expense
- do not overwrite posted history; use reversal, cancellation, credit-note,
  reopen, or the dedicated posted tax-code correction workflow
- create one ledger account per real bank account, debit card, credit card, and
  loan
- reconcile every bank and debit account to statements
- tie every credit-card liability account to the card statement
- do not use manual journals to create normal AR, AP, immediate cash-sale, or
  immediate cash-purchase or refund activity when invoice, sales receipt,
  customer refund, bill, expense, vendor refund, receipt, payment, or apply
  workflows exist
- do not move dates only to make reconciliation easier
- do not use opening balances to smuggle in current-period activity
- treat void and reversal workflows as dated accounting events, not as silent
  deletion of historical activity
- do not use `resources:batchDelete` to remove posted invoices, bills, sales
  receipts, customer refunds, receipts, expenses, vendor refunds, payments,
  payroll runs, inventory activity, or fixed-asset activity
- if an old hard-delete bug already left a posted invoice, bill, sales
  receipt, customer refund, receipt, expense, vendor refund, payment, payroll,
  inventory, or fixed-asset entry orphaned with no owning source row, confirm
  the source row is gone and then use
  `entries/{entry_id}:reverse` to repair the GL
- when voiding or reversing a posted source-aware document such as an invoice,
  bill, sales receipt, customer refund, receipt, expense, vendor refund, or
  payment, set the economically correct `action_date`; when using generic
  `entries/{entry_id}:reverse`, set `reversal_date` instead; if the
  workflow-specific date is optional and omitted, Vibooks defaults it to
  today
- financial reports follow posted entry dates, not the current document status
  alone

## Resource-Creation Rule

When the user does not explicitly say which Vibooks business resources to
create, infer and fill the normal first-class resources directly from the
materials provided.

Default priority:

- if the materials identify a customer, vendor, invoice, bill, sales receipt,
  customer refund, receipt, expense, vendor refund, payment, item, bank
  statement line, or credit-card statement line, create or update those
  resources instead of waiting for the user to enumerate each one
- create supporting master data such as `customers` or `vendors` when the
  source materials clearly establish the party and that master record is needed
- create `items` when repeated products, services, or purchase categories
  clearly need reusable default accounts, tax codes, or prices
- use `bank-lines` for real bank, debit-card, and credit-card statement lines
  when the materials are statement evidence
- prefer first-class document workflows over manual journals when the materials
  support them
- populate as many fields as the materials support, but do not invent parties,
  amounts, dates, tax treatment, currencies, or statement details
- if the source materials are incomplete but still sufficient for a normal
  business-document workflow, create the supported resource and leave only the
  unsupported fields unresolved

## Recurring Bookkeeping

- create recurring templates for activity that repeats on a schedule and should
  stay first-class, such as rent bills, subscription invoices, monthly
  depreciation journals, or standing accruals
- create `receipt:create-recognition-schedule` when a fully unapplied customer
  receipt should become deferred revenue
- create `payment:create-recognition-schedule` when a fully unapplied vendor
  payment should become a prepaid expense
- create `recognition-schedules` directly only when there is no better
  first-class source workflow for the originating balance-sheet position, such
  as accrued revenue or accrued expense entries
- choose `invoice`, `bill`, or `entry` template kinds based on the real source
  workflow; do not turn recurring AR or AP into manual journals
- do not use recurring templates to imitate prepaid or deferred recognition
  schedules line by line when one originating balance should be amortized or
  recognized over time
- use `recognition-schedules/{scheduleId}:cancel` only before any due line has
  been posted; once releases are posted, reverse the latest release first and
  keep the source-aware trail intact
- use `post-v1-books-book-id-recognition-schedules-schedule-id-post-due` to
  catch up every due recognition line through an `as_of` date
- use `:reverseLatest` on the recognition schedule when the latest release was
  posted on the wrong date or into the wrong period; do not correct those
  schedule-backed entries with generic entry reverse
- use `post-v1-books-book-id-recurring-templates-run-due` to catch up missed
  scheduled work through an `as_of` date
- pause a recurring template when the business event has stopped temporarily;
  patch the schedule when the cadence changed; resume only after the next
  remaining occurrence is correct
- for recurring journal templates, keep `source_type` business-meaningful and
  prefer a stable `source_ref_prefix` so generated entries remain auditable

## Customer-Facing Document Templates

- use `document-templates` for customer- or vendor-facing HTML/PDF presentation
  of invoices, bills, sales receipts, purchase receipts, customer refunds,
  expenses, vendor refunds, receipts, and payments
- do not use `recurring-templates` for presentation/layout; recurring templates
  create scheduled bookkeeping documents or journals
- list `get-v1-books-book-id-document-templates` before editing so you can see
  built-in ids, current global defaults, current-book overrides, and supported
  `document_type` values
- create a custom template with `post-v1-books-book-id-document-templates`
  using `name`, `document_type`, `scope` (`global` or `book`), `book_id` for
  book scope, and `html`
- patch an existing custom template, or patch a built-in template id to store a
  built-in override; use `:reset` to clear a built-in override rather than
  deleting built-ins
- use `:setDefault` on a global template for the global default, or on a
  book-scoped template for that book's default
- render a real source document with
  `post-v1-books-book-id-documents-document-type-document-id-render`; omit
  `template_id` to use the effective default or pass a template id explicitly
- template HTML supports escaped `{{variable_name}}` tokens such as
  `company_name`, `company_address`, `book_code`, `doc_title`, `doc_number`,
  `doc_date`, `doc_due_date`, `doc_party`, `doc_currency`, `doc_subtotal`,
  `doc_tax`, `doc_total`, `doc_amount_due`, `doc_description`, `generated_at`,
  `theme_color`, and `font_family`

## Chart Of Accounts Rules

Create a new account only when the reporting or reconciliation meaning is
genuinely different.

Common patterns:

- bank account, checking account, debit card account, petty cash: `asset`,
  `debit`, `cash` or `bank`; when tied to statements, use statement role
  `bank_asset`
- accounts receivable: `asset`, `debit`, `current_asset`
- inventory: `asset`, `debit`, `inventory`
- prepaid expense: `asset`, `debit`, `prepaid`
- fixed asset: `asset`, `debit`, `fixed_asset`
- vendor advances: `asset`, `debit`, `current_asset`
- accounts payable: `liability`, `credit`, `current_liability`
- credit card payable: `liability`, `credit`, `current_liability`; when tied
  to statements, use statement role `credit_card_liability`
- customer deposits: `liability`, `credit`, `current_liability`
- owner capital or retained earnings: `equity`, `credit`, `equity`
- operating revenue: `revenue`, `credit`, `revenue`
- other income: `revenue`, `credit`, `other_income`
- cost of goods sold: `expense`, `debit`, `cost_of_sales`
- normal operating expenses: `expense`, `debit`, `expense`
- bank fees, interest expense, and FX loss: `expense`, `debit`,
  `other_expense`

## Date Rules

Use the correct field for the correct date:

- `transaction_date`: when the economic event happened
- `posting_date`: when the ledger recognizes it
- `issue_date`: the document date on an invoice or bill
- `due_date`: the contractual due date
- `sale_date`: the document date on a sales receipt
- `refund_date`: the document date on a customer or vendor refund
- `expense_date`: the document date on an immediate paid purchase
- `receipt_date`: when cash was received
- `payment_date`: when cash left the funding account
- `deposit_date`: when already-held funds were deposited into the bank account
- `statement_date`: the date on a bank or card statement line
- `application_date`: when a receipt or payment is applied to AR or AP
- `action_date`: the accounting date for cancellation or void workflows on
  posted source documents

Posting rules:

- invoice: use the invoice issue date
- sales receipt: use the sale date
- customer refund: use the refund date
- bill: use the supplier bill date
- expense: use the purchase date
- vendor refund: use the refund date
- receipt or payment: use the actual settlement date
- bank deposit: use the date the deposit hits the bank account
- bank fee, transfer, owner contribution, loan funding, loan repayment: use the
  bank settlement or statement date
- accrual or month-end adjustment: use the last day of the affected period
- opening balances: use one verified cutover date

If a closed period must change, stop and ask before proceeding.

## Prefer First-Class Workflows

Use:

- `items` for reusable products, services, and inventory defaults that should
  populate source-document lines consistently
- keep `item_id` on normal sales and purchase document lines whenever the
  activity is about a real tracked product or service, so the platform can
  apply the saved revenue, expense, inventory, COGS, and tax defaults
- `invoice` for customer sales on credit
- `sales-receipt` for customer sales paid immediately
- `customer-refund` for customer returns, cash refunds, and customer-balance
  refunds
- `receipt` then `receipt:apply` for customer cash collection
- `bill` for vendor purchases on credit
- `expense` for immediate payee outflows that should not leave AP open, such as
  vendor purchases, loan repayments, owner draws, and tax remittances
- `vendor-refund` for supplier refunds, rebates, and vendor-balance refunds
- `payment` then `payment:apply` for vendor settlement
- `transfers` for bank, debit, cash, and credit-card statement-account
  movements between the business's own accounts
- `settlements` for platform, payment-processor, POS-summary, OTA, and other
  external payout events where gross activity, fees, refunds, taxes, reserves,
  and net cash settle together
- `bank-deposits` when cash, undeposited funds, owner contributions, loan
  proceeds, direct income, customer-deposit holding balances, or similar
  non-statement source accounts are deposited into a bank statement account
- `payroll-runs` for payroll results that post wages, withholdings, employer
  tax, liabilities, and cash settlement
- `opening-balances` for cutover balances
- `bank-lines` plus `reconciliations` for bank, debit, and credit-card
  statement accounts
- `bank-lines/{lineId}:create-processor-settlement` only as a statement-line
  shortcut when the evidence is a payout that should still become a canonical
  `settlement`
- manual journal entries only when no better workflow exists

Subledger integrity rules:

- invoices create receivables; receipts settle receivables through apply
  workflows
- sales receipts recognize revenue and cash immediately and do not leave AR
  open
- customer refunds either reverse immediate-sale revenue/tax lines or return
  customer deposits and overpayments without creating new AR
- inventory item lines on customer refunds receive stock automatically and
  reverse the inventory versus COGS leg inside the same refund posting
- bills create payables; payments settle payables through apply workflows
- when goods arrive before the supplier bill, create a purchase receipt first,
  then create the later bill with `purchase_receipt_ids` so the bill clears the
  receipt accrual instead of receiving inventory a second time
- expenses recognize the immediate outflow and funding movement immediately and
  do not leave AP open; expense lines may debit expense, asset, liability, or
  equity accounts as long as they are real non-statement business accounts
- inventory item lines on invoices and sales receipts issue stock
  automatically and add the required COGS versus inventory support lines
- inventory item lines on bills and expenses receive stock automatically into
  inventory instead of requiring a separate inventory receipt or adjustment
- do not use purchase receipts for same-day billed purchases; use bills or
  expenses directly when the supplier tax document is already available
- vendor refunds either reverse purchase-side expense/asset and tax lines or
  return vendor advances without creating new AP
- inventory item lines on vendor refunds issue stock automatically using the
  refund line value instead of requiring a separate inventory issue
- bank deposits debit the destination bank statement account and credit one or
  more non-statement source accounts such as undeposited funds, cash on hand,
  revenue, equity, loan liabilities, or customer-deposit holding balances
- do not replace receipt or payment application with ad hoc journal lines
  against AR or AP control accounts
- if a document or settlement uses a non-default control account, pass the
  explicit `ar_account_id` or `ap_account_id` at creation time and keep later
  apply, credit-note, and correction workflows on that same control account
- use `unapplied_account_id` for real customer deposits or vendor advances that
  should remain open outside the main receivable or payable balance
- do not record payroll through generic journal entries when the payroll
  workflow can express it
- when purchase-side tax is only partly claimable, keep the statutory
  `tax_code_id` on the purchase line and set `tax_claimable_ratio` between `0`
  and `1`; Vibooks will keep the non-claimable portion inside the business
  line and only carry the claimable portion into tax returns
- if a transaction is partially settled, keep the remaining open amount in the
  subledger instead of forcing full settlement
- use inventory adjustments only for stock counts, shrinkage, spoilage,
  reclassifications, opening stock corrections, or other true exceptions; do
  not split normal buy/sell activity into both a source document and a second
  manual inventory movement

Reimbursement and vendor-advance rule:

- for employee reimbursements, owner-paid expenses, or other AP items that
  should settle through a dedicated payable such as `Reimbursement Payable`,
  create the bill and payment with the same `ap_account_id`, then use
  `payment:apply` on that same payables control account
- when a bill was funded personally by an owner, shareholder, or other non-bank
  source, set `payment.funding_account` to the real balance-sheet funding
  account such as `Cash from owner` or `Shareholder Loan`
- if the payment exceeds the open bill and should remain as a vendor advance or
  prepayment, route the excess through `unapplied_account_id`

## Common Posting Patterns

- cash sale: prefer `sales-receipt`; economically it debits bank or cash and
  credits revenue
- bank transfer or credit-card payment: prefer `transfers`; economically it
  debits the destination statement account and credits the source statement
  account
- bank deposit: prefer `bank-deposits`; economically it debits the destination
  bank statement account and credits the source cash, tax receivable, clearing,
  revenue, equity, loan, or holding balance that explains the deposit
- platform payout, merchant-processor remittance, OTA remittance, or other
  net settlement: prefer `settlements`; economically it ties gross activity,
  fees, refunds, reserves, taxes, and net cash to one source-aware event
- summary-based restaurant or small-lodging close: use sales receipts,
  expenses, receipts or payments, and settlements plus dimensions such as
  store, channel, or property; do not model POS or PMS front-office activity
  inside Vibooks
- customer refund or deposit return: prefer `customer-refund`; economically it
  credits the funding account and debits revenue/tax reversal lines or a
  customer-balance liability
- owner contribution: debit bank or cash, credit equity
- owner draw: prefer `expense` for the withdrawal itself; debit drawings or
  equity and credit bank, card, or cash
- loan proceeds: debit bank, credit loan payable
- loan repayment: prefer `expense`; debit loan principal, debit interest
  expense if any, and credit bank for the full payment
- tax remittance: prefer `expense`; debit the tax liability being settled and
  credit bank or cash
- tax return preparation: prefer `tax-returns`; prepare a draft return for the
  filing period, review the summarized payable and recoverable rows, then file
  the return so Vibooks generates the settlement reclass entry through the
  chosen tax-settlement clearing account
- debit-card purchase: prefer `expense`; economically it debits expense,
  prepaid, inventory, fixed asset, liability settlement, or equity draw lines
  and credits bank
- credit-card purchase: prefer `expense`; economically it debits expense,
  prepaid, inventory, fixed asset, liability settlement, or equity draw lines
  and credits the specific card liability
- vendor refund or rebate: prefer `vendor-refund`; economically it debits the
  receiving bank/card account and credits expense, inventory/asset, tax, or a
  vendor-advance asset
- credit-card payment: debit the specific card liability; credit the paying
  bank account
- payroll run: use the payroll workflow so wages, employee withholdings,
  employer tax, payroll liabilities, and cash settlement stay grouped as one
  payroll posting

For credit cards, do not force card activity into a cash account just to use
the statement reconciliation workflow.

## Opening Balances

- use `post-v1-books-book-id-opening-balances`
- load only asset, liability, and equity balances at cutover
- do not load revenue or expense accounts as opening balances unless the
  cutover design explicitly requires it
- the opening balance entry must tie to a verified prior balance sheet or
  opening trial balance
