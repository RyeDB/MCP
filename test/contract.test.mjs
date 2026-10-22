import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const doc = JSON.parse(readFileSync(new URL("../contracts/mcp-tools.json", import.meta.url), "utf8"));
const tools = doc.properties.tools.const;

test("the contract is a JSON Schema 2020-12 document listing the tools", () => {
  assert.equal(doc.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(doc.type, "object");
  assert.deepEqual(doc.required, ["tools"]);
  assert.ok(Array.isArray(tools) && tools.length > 0);
});

test("tool names are unique snake_case and every tool is described", () => {
  const names = tools.map((t) => t.name);
  assert.equal(new Set(names).size, names.length, "duplicate tool name");
  for (const t of tools) {
    assert.match(t.name, /^[a-z][a-z0-9_]*$/, t.name);
    assert.ok(typeof t.description === "string" && t.description.length > 10, `${t.name} needs a description`);
  }
});

test("every input schema is an object schema whose required fields exist", () => {
  for (const t of tools) {
    assert.equal(t.inputSchema.type, "object", t.name);
    for (const r of t.inputSchema.required ?? []) assert.ok(r in (t.inputSchema.properties ?? {}), `${t.name}: required "${r}" is not a property`);
    for (const [k, p] of Object.entries(t.inputSchema.properties ?? {})) assert.ok(p.type || p.enum, `${t.name}.${k} has no type`);
  }
});

test("agents cannot verify, retire or approve anything", () => {
  for (const t of tools) assert.doesNotMatch(t.name, /verify|retire|approve|admin/, t.name);
});

test("the README table lists exactly the agent-facing tools", () => {
  const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
  const listed = [...readme.matchAll(/^\| `([a-z_]+)` \|/gm)].map((m) => m[1]).sort();
  const agent = tools.map((t) => t.name).filter((n) => n !== "hook").sort();
  assert.deepEqual(listed, agent);
});
