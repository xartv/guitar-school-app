# Claude Development Rules

This project is developed using AI-assisted coding.

Before implementing any code you MUST read:

- docs/spec.md
- docs/architecture.md
- docs/ui.md
- docs/tasks.md

These documents define the product requirements and architecture.

---

# Skills

The project uses reusable AI skills located in the `/skills` directory.

When performing tasks, the agent should select the most appropriate skill and follow its instructions.

Available skills:

- feature-development — implement features according to docs/tasks.md
- react-component-builder — generate React components using project UI rules
- prisma-expert — write and optimize Prisma queries
- nextjs-debugger — debug Next.js App Router issues
- code-review — perform architecture and code quality reviews

Skill files:

/skills/feature-development.md
/skills/react-component-builder.md
/skills/prisma-expert.md
/skills/nextjs-debugger.md
/skills/code-review.md

---

# Skill Usage Rules

Before implementing code, the agent should:

1. Determine if a relevant skill exists in `/skills`
2. Load the skill instructions
3. Follow the skill workflow

If multiple skills are relevant, prioritize:

1. feature-development
2. prisma-expert
3. react-component-builder
4. nextjs-debugger
5. code-review

---

# Task Execution Rules

Always follow these rules:

1. Implement tasks strictly in the order defined in `docs/tasks.md`
2. Implement only ONE task at a time
3. Do not implement future tasks
4. Keep changes minimal and focused

After completing a task:

- Ensure the project compiles
- Ensure TypeScript has no errors
- Ensure the app build with `npm run build`

---

# Agent Pipeline

The main agent must follow this pipeline for every task:

## Step 1 — Pre-implementation: UI Design (conditional)

If the task involves creating or redesigning a UI component or visual layout:

→ Launch **`ui-design-advisor`** agent BEFORE writing any code.

The ui-design-advisor will research design trends and propose implementation options.
Wait for its result, then implement based on its recommendations.

Skip this step for tasks that are purely server-side (actions, schema, migrations).

## Step 2 — Implementation

Implement the task following the relevant skill from `/skills`.

## Step 3 — Post-implementation: Code Review (mandatory)

After every task implementation:

→ Launch **`feature-code-reviewer`** agent.

Wait for the review result. Fix all issues raised before proceeding.

## Step 4 — Post-review: QA Testing (mandatory)

After all code review issues are fixed:

→ Launch **`feature-qa-tester`** agent.

The qa-tester runs browser tests and produces a report. If issues are found, fix them.

## Pipeline Summary

```
[ui-design-advisor]     ← only for UI tasks
        ↓
  implementation
        ↓
[feature-code-reviewer] ← always
        ↓
    fix issues
        ↓
[feature-qa-tester]     ← always
```

---

# Architecture Rules

The architecture defined in `docs/architecture.md` is the source of truth.

Key rules:

- Use **Server Actions** instead of API routes
- Use **Prisma** as the only database layer
- Avoid Redux, Zustand, React Query
- Prefer local component state

---

# UI Rules

The UI must follow the specification in `docs/ui.md`.

Key points:

- Use shadcn/ui components
- Use CSS Modules for styling
- Levels must be rendered as Accordion components
- Skills must be displayed using SkillCard components

---

# Code Quality Rules

Follow these coding practices:

- Use TypeScript strictly
- Keep components small and focused
- Prefer simple and readable code over abstraction
- Avoid unnecessary libraries

---

# Database Rules

All database operations must go through:

Server Actions → Prisma → Database

Do not access the database directly from client components.

---

# When Requirements Are Unclear

If something is unclear:

1. Check `docs/spec.md`
2. Check `docs/architecture.md`
3. If still unclear, ask for clarification instead of guessing.

---

# MCP Tools

Three MCP servers are available. Use them proactively where applicable.

## context7 — Library Documentation

Use when you need accurate, up-to-date API documentation for any library used in this project (Next.js, Prisma, shadcn/ui, React).

Workflow:
1. `mcp__context7__resolve-library-id` — find the library ID by name
2. `mcp__context7__query-docs` — fetch relevant documentation

Use before implementing anything that involves a library API you are not 100% certain about.

## prisma-local — Prisma Database Operations

Use instead of running Prisma CLI commands manually.

Available tools:
- `mcp__prisma-local__migrate-dev` — run a migration after schema changes
- `mcp__prisma-local__migrate-status` — check current migration status
- `mcp__prisma-local__migrate-reset` — reset the database (destructive, confirm with user first)
- `mcp__prisma-local__Prisma-Studio` — open Prisma Studio to inspect database data

Always use these tools instead of running `npx prisma migrate dev` via Bash.

## playwright — Browser Automation and UI Verification

Use to verify that UI features work correctly after implementation.

Available tools:
- `mcp__playwright__browser_navigate` — open a page
- `mcp__playwright__browser_snapshot` — get accessibility snapshot of the page
- `mcp__playwright__browser_take_screenshot` — capture a screenshot
- `mcp__playwright__browser_console_messages` — check for JS errors in console
- `mcp__playwright__browser_network_requests` — inspect network/Server Action calls
- `mcp__playwright__browser_click`, `browser_fill_form`, `browser_type` — interact with UI

Use after implementing a feature to verify it renders and works correctly in the browser.