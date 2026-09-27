# Vibooks Agent Skills

[Vibooks](https://vibooks.ai/) helps small businesses keep their books with an AI agent. This repository is the public source for the Vibooks Agent Skill: instructions that help an agent install or reconnect to Vibooks, work through supported bookkeeping flows, reconcile accounts, and review the results against source records.

## Install

If you use the official Vibooks plugin, the skill is already included. Install or update the plugin through your agent client's plugin directory; you do not need a second standalone copy.

For a standalone Agent Skills installation, run:

```sh
npx skills add vibooks-ai/skills --skill vibooks -g
```

Then ask your agent to use Vibooks for a specific task. The skill guides it to connect through the installed Vibooks app, `vibooks-cli`, and the live local API. You can also read the [web copy](https://vibooks.ai/skill.md) before installing.

## What is here

- [`skills/vibooks/SKILL.md`](skills/vibooks/SKILL.md) defines when to use the skill and its core operating rules.
- [`skills/vibooks/references/`](skills/vibooks/references/) covers installation, bookkeeping, reconciliation, verification, and escalation.
- [`skills/vibooks/jurisdictions/`](skills/vibooks/jurisdictions/) describes supported jurisdiction workflows and their boundaries.

The skill uses Vibooks' supported product workflows. It does not submit government filings on a user's behalf or replace review of the underlying business records.

For the app and installation options, visit [vibooks.ai](https://vibooks.ai/). For help, visit [Vibooks support](https://vibooks.ai/support/).
