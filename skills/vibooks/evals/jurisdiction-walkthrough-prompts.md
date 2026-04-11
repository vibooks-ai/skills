# Jurisdiction Walkthrough Prompts

Use these prompts for manual behavior walkthroughs when validating
jurisdiction-profile routing and stop conditions.

Run each prompt against a client or model that can use the `vibooks` skill.
Evaluate the response against the expected behavior checklist below the prompt.

These prompts are for behavior review, not trigger-only review.

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

- model or client used
- skill revision reviewed
- prompt exercised
- chosen jurisdiction profile
- whether official research was used correctly
- whether the stop boundary was honored
- any drift between expected and actual behavior
