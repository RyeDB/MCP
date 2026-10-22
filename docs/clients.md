# Client setup

Only Claude Code and Codex have been tested.

## Claude Code

`ryedb init` (from RyeDB core) writes `.claude/settings.local.json` with hooks and `.mcp.json` with this server. Claude Code asks you to approve a project MCP server the first time. Hooks are read when a session starts: **restart the session after `init`**.

## Codex

`ryedb init --codex` writes `.codex/hooks.json` and a managed block in `.codex/config.toml`. Codex runs project hooks only once the project is trusted and the hooks are reviewed (`/hooks` in the CLI). Codex has no HTTP hook type, so hooks are `mcp_tool` hooks that call the `hook` tool on this server (no process start per hook), with `SessionStart` as a command hook.

## Anything else

The server needs nothing client-specific: stdio transport, newline-delimited JSON-RPC 2.0, protocol version echoed from `initialize`, capabilities `{ tools: {} }`. Point your client at `node <core>/packages/cli/dist/cli.js mcp` with the project directory as the working directory (or set `RYEDB_ROOT`).
