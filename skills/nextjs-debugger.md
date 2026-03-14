# Skill: Next.js Debugger

## Purpose

Identify and fix common Next.js App Router issues.

## Common Issues to Check

### Hydration Errors

Check for:

-   server/client mismatch
-   non-deterministic rendering

### Server vs Client Boundaries

Ensure:

-   Server Actions run on the server
-   Client components use `use client`

### Data Fetching Issues

Check:

-   Server Action usage
-   caching behavior
-   revalidation

### Build Errors

Verify:

-   TypeScript correctness
-   proper imports
-   correct file structure

## Debugging Strategy

1. Identify error location
2. Determine if issue is server or client side
3. Fix smallest possible piece of code
4. Re-run development server
5. Verify fix in the browser using Playwright:
   - `mcp__playwright__browser_navigate` — open the affected page
   - `mcp__playwright__browser_console_messages` — check for hydration or JS errors
   - `mcp__playwright__browser_network_requests` — verify Server Action calls succeed
   - `mcp__playwright__browser_snapshot` — inspect rendered output

## Documentation Lookup

When unsure about Next.js App Router behavior (caching, revalidation, server/client boundaries):

1. `mcp__context7__resolve-library-id` with query "next.js"
2. `mcp__context7__query-docs` for the relevant topic
