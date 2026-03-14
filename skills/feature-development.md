# Skill: Feature Development (Task Driven)

## Purpose

Implement project features by strictly following the task plan defined
in `docs/tasks.md`.

## When to Use

Use this skill whenever a new feature or task must be implemented.

## Required Reading

Before implementing anything, read:

-   CLAUDE.md
-   docs/spec.md
-   docs/architecture.md
-   docs/ui.md
-   docs/tasks.md

## Execution Strategy

1. Identify the requested task in `docs/tasks.md`.
2. **If the task involves UI components or visual design** → launch the `ui-design-advisor` agent first. Wait for its output before writing any code.
3. Implement **only that single task**.
4. Do not implement future tasks.
5. Make the smallest possible code change to satisfy the task.
6. After implementation → launch the `feature-code-reviewer` agent. Fix all issues it raises.
7. After fixing review issues → launch the `feature-qa-tester` agent. Fix any issues it finds.

### When to trigger ui-design-advisor

Trigger it when the task involves:
- Creating a new visual component (SkillCard, LevelAccordion, SkillProgress, etc.)
- Redesigning or restyling an existing component
- Implementing a new page layout or screen

Do NOT trigger it for:
- Server Actions
- Prisma schema changes and migrations
- Utility functions and lib files
- Tasks that only add a button or minor UI element to an existing component

## Implementation Rules

-   Follow architecture described in `docs/architecture.md`.
-   Use Server Actions for mutations.
-   Use Prisma for database access.
-   Keep components small and focused.
-   Prefer simple implementations over abstraction.

## Verification Checklist

After implementing the task:

- Project builds successfully
- TypeScript has no errors
- `npm run dev` runs correctly
- Only relevant files were modified
- UI verified in browser using Playwright:
  1. `mcp__playwright__browser_navigate` — open the app (typically `http://localhost:3000`)
  2. `mcp__playwright__browser_snapshot` or `browser_take_screenshot` — confirm the feature renders
  3. `mcp__playwright__browser_console_messages` — confirm no errors in console
  4. If the feature involves user interaction: use `browser_click`, `browser_fill_form`, `browser_type` to test it

## Anti‑Patterns

Avoid:

-   Implementing multiple tasks at once
-   Refactoring unrelated code
-   Introducing new libraries without necessity
