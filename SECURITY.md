# Security

Persa runs on your own machine, reads one file, and sends nothing anywhere. It
has no account system and no server of its own beyond the two you start
yourself: `persa edit`, which binds to 127.0.0.1, and `persa serve`, which
speaks MCP over stdio unless you pass `--http`.

The one thing worth saying plainly: **`persa serve --http` has no
authentication.** It serves your persona to whoever can reach the port. That
is fine on loopback and not fine on a public address, so if you put it behind
a tunnel, put something in front of it, and never put anything in a persona
that you would not hand to a stranger.

## Reporting something

Open a GitHub security advisory on this repository, or an issue if it is not
sensitive. There is no bounty and no formal SLA: this is a small tool
maintained by people with other jobs, and pretending otherwise would be worse
than saying so.
