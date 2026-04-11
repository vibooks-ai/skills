# Bootstrap Workflows

## Contents

- Discover the API first
- Jurisdiction profiles
- Bootstrap a new book
- Cleanly rebuild a book

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

## Jurisdiction Profiles

Before choosing country-specific defaults, route the book through a
jurisdiction profile.

Rules:

- use the book or company country, tax registration, and other explicit setup
  as the authority when they already exist
- use source documents or the business profile next when they clearly establish
  the jurisdiction
- use the current device country only as a last-resort bootstrap suggestion
- treat the operator's nationality or UI language as non-authoritative
- choose the jurisdiction profile before choosing the industry preset
- keep jurisdiction and industry as separate layers
- if the shipped product later exposes first-class jurisdiction setup, prefer
  that official product path over skill-only manual setup

Current public profiles:

- `generic_global`: conservative fallback when no stronger jurisdiction profile
  is documented
  [../../jurisdictions/generic-global.md](../../jurisdictions/generic-global.md)
- `ca_smb`: ordinary Canadian small-business and private-enterprise books
  [../../jurisdictions/ca/smb.md](../../jurisdictions/ca/smb.md)
- `us_smb`: routing skeleton for ordinary United States small-business books
  with explicit state and local tax stop conditions
  [../../jurisdictions/us/smb.md](../../jurisdictions/us/smb.md)

Reference:

- jurisdiction routing and support states:
  [../../jurisdictions/index.md](../../jurisdictions/index.md)

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
  when the profile is clear, but treat the saved book or company setup as the
  authority when it already exists
- if the user profile does not make `country` or base currency clear, use the
  current device country and its normal operating currency only as a bootstrap
  suggestion
- treat that base currency as Vibooks `functional_currency`, and keep
  `presentation_currency` the same unless the user explicitly wants something
  different
- choose the jurisdiction profile before choosing the industry preset
- when a documented jurisdiction profile applies, follow its chart, tax,
  numbering, and measurement guidance instead of inventing local defaults
- when the business shape is clear, inspect `get-v1-book-presets` and use the
  nearest official preset:
  `generic_smb` for most service businesses, `ecommerce_platform` for
  marketplace or channel-heavy sellers, `restaurant_summary` for summary-based
  restaurant books, and `lodging_summary` for Airbnb, short-term rental, or
  small lodging books
- keep jurisdiction setup separate from industry preset selection; do not
  invent combined pseudo-presets
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
