# Contributing

Persa is small on purpose. It compiles a YAML file into text an agent will
read, and it does not want to become a platform. The most useful contributions
are usually the least dramatic ones: a target whose character limit moved, a
trait phrase that reads badly, a bug in the trimmer.

## Running it

```bash
npm install
npm test                  # node --test, no framework
node src/cli.js init      # a persona to play with
node src/cli.js edit      # the editor, on localhost
```

There are no build steps and no dependencies beyond `yaml` and the MCP SDK.

## Adding or fixing a target

A target is one entry in [`src/targets.js`](src/targets.js): its character
limit, whether the agent reads it as a system prompt or a message, whether the
field keeps markdown, where a person pastes it, and the numbered steps
`persa install` prints.

Product details go stale faster than anything else here. If you are correcting
one, say in the pull request where you saw it and when. "ChatGPT's box is 1500
characters" is a claim; "ChatGPT's box is 1500 characters, checked 2026-10-02"
is a claim someone can re-check a year from now.

## Adding a trait

Traits live in [`src/traits.js`](src/traits.js) as four bands each. The rule
that matters: a trait at 50 must produce nothing at all. A persona should say
only what its owner actually cares about, and a compiler that pads every
prompt with seven neutral sentences makes every persona sound the same.

## Tests

`node --test`, in `test/`. New behaviour needs a test that would fail without
it. Tests that spawn the CLI are preferred for anything a user types, because
argument parsing and exit codes are where CLIs actually break.

## Style

Match what is there. Comments explain why a thing is the way it is, not what
the next line does. If a comment would only restate the code, leave it out.

## What will probably be declined

- A runtime. Persa never sits between you and your agent.
- Memory or facts about the user. That belongs to the agents.
- A hosted service in this repository.
- Anything that makes a persona longer by default.
