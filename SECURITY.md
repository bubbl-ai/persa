# Security

Persa makes no outbound service requests. The editor reads and writes your
persona file, and the MCP server returns persona data to clients that connect.
There is no account system. `persa edit` binds to 127.0.0.1 through the CLI;
`persa serve` speaks MCP over stdio unless you pass `--http`, which also defaults
to 127.0.0.1. `serve --http --host <address>` can expose it to other machines.

The one thing worth saying plainly: **`persa serve --http` has no
authentication.** It serves your persona to whoever can reach the port,
including the raw YAML through `persona://source` (comments and unknown keys
included). `/health` also returns the persona name and local file path, or a
load error. The MCP interface has no write tools. If you put it behind
a tunnel, add authentication in front of it, and never put anything in a persona
that you would not hand to a stranger.

## Current limitations

The editor has a write endpoint with no authentication or Origin validation.
A request from an unrelated Origin can save a persona, including when its
JSON body is sent as `text/plain`; browser private-network restrictions may
block delivery, but Persa does not enforce that protection itself. Keep the
editor local and stop it when finished editing.

The HTTP MCP server has no request-body size limit, and a malformed Host
header can terminate the process. Until those are fixed, an HTTP deployment
needs a proxy that authenticates clients, validates requests and limits body
size. Loopback binding alone is not a substitute for request validation.

## Reporting something

Open a GitHub security advisory on this repository, or an issue if it is not
sensitive. There is no bounty and no formal SLA: this is a small tool
maintained by people with other jobs, and pretending otherwise would be worse
than saying so.
