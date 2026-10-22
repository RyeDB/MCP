# RyeDB™ MCP server

The [Model Context Protocol](https://modelcontextprotocol.io) server for RyeDB™: persistent project memory and a durable agent-to-agent channel (RyeChannel) for coding agents.

> **Status: early.** The server is part of RyeDB core, which is developed in a private repository and is not publicly available yet. This repository is the server's public interface: the tool contract, client setup, and conformance checks. Nothing here pretends otherwise: you cannot run the server from this repository alone.

## Tools

| Tool | What it does |
|---|---|
| `memory_brief` | The current project memory: rules, decisions, known failures and their fixes. |
| `error_search` | Search recorded failures by text, signature or file path. |
| `error_resolve` | Record the root cause and fix for a failure. Stored as an unconfirmed claim. |
| `rule_propose` | Propose a rule in plain language. Advisory, never blocks. |
| `rule_compile` | Propose a blocking rule as a deny pattern with must-fail and must-pass examples. RyeDB proves the pattern; a human verifies it before it can block. |
| `decision_record` | Record a design decision and why it was made. |
| `task_set` | Set the current task. |
| `channel_post` | Post a persistent message to another agent, or broadcast. Kinds include `task` (work to do) and `result` (the answer, with `reply_to` set to the task). |
| `channel_read` | Read RyeChannel, or fetch and acknowledge your unread messages. |
| `channel_ack` | Tell the sender a message arrived (`received`) or that its task is finished (`done`). |
| `channel_tasks` | Tasks addressed to you or to everyone; open by default. |

There is also an internal `hook` tool used by Codex `mcp_tool` hooks. It is not for agents.

**What is deliberately not a tool:** verifying, retiring or approving anything. Agents can propose; only a human or CI can verify, and only verified rules can block a tool call. The trust model is documented with core.

## Contract

[`contracts/mcp-tools.json`](contracts/mcp-tools.json) is the machine-readable contract: a JSON Schema (2020-12) document listing every tool with its description and input schema. **It is generated** from the server's own tool definitions by `npm run contracts` in RyeDB core, and is never edited here. [`contracts/SOURCE.md`](contracts/SOURCE.md) records which commit it came from. `npm test` here checks that the file is well formed and internally consistent.

## Use it

With access to RyeDB core, build it, then in your project:

```sh
node /path/to/core/packages/cli/dist/cli.js init            # Claude Code: hooks + .mcp.json
node /path/to/core/packages/cli/dist/cli.js init --codex    # also Codex: .codex/hooks.json + MCP entry
```

or add the server by hand. Claude Code, `.mcp.json`:

```json
{ "mcpServers": { "ryedb": { "command": "node", "args": ["/path/to/core/packages/cli/dist/cli.js", "mcp"] } } }
```

Codex, `.codex/config.toml`:

```toml
[mcp_servers.ryedb]
command = "node"
args = ["/path/to/core/packages/cli/dist/cli.js", "mcp"]
```

The server speaks MCP over stdio and talks to a per-project daemon over a local socket; it starts the daemon on demand. Details: [docs/clients.md](docs/clients.md).

## Tested with

Claude Code 2.1.307 and 2.1.308, and Codex CLI 0.163.0, both against the real binaries. Other MCP clients should work, since the server uses only `initialize`, `tools/list` and `tools/call` over newline-delimited JSON-RPC, but they have **not** been tested.

## Development

```sh
npm test    # validates contracts/mcp-tools.json
```

Requires Node 22.18 or newer. Copyright (c) 2026 RyeDB. Licensed under Apache-2.0 ([NOTICE](NOTICE)).

---

RyeDB™ is a trademark of RyeDB. The Apache-2.0 licence covers the code; it does not grant permission to use the name or logo (section 6).
