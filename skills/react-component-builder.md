# Skill: React Component Builder

## Purpose

Generate clean React components following project architecture and UI rules.

## Pre-Implementation Step

Before building any new component or redesigning an existing one:

→ Launch the **`ui-design-advisor`** agent.

Provide it with: the component name, its purpose, and what data/interactions it handles.
Wait for its design recommendations, then implement based on those proposals.

Skip this step only if the task explicitly specifies exact visual implementation with no design decisions left open.

## Framework Context

This project uses:

-   Next.js App Router
-   TypeScript
-   shadcn/ui components
-   CSS Modules

## Component Guidelines

When creating components:

-   Use functional components
-   Use strict TypeScript typing
-   Keep components small
-   Avoid large monolithic files

## Styling

Use:

-   shadcn/ui primitives when possible
-   CSS Modules for custom styles

Avoid:

-   global CSS
-   inline styling unless necessary

## Recommended Structure

Example component structure:

ComponentName/ - ComponentName.tsx - ComponentName.module.css - types.ts
(optional)

## Best Practices

-   Keep UI logic separate from server logic
-   Avoid unnecessary state
-   Prefer composition over complex props

## Common Components in This Project

Examples:

- SkillCard
- SkillProgress
- LevelAccordion

## Documentation Lookup

Before building a component with a shadcn/ui primitive, fetch its current API:

1. `mcp__context7__resolve-library-id` with query "shadcn/ui"
2. `mcp__context7__query-docs` for the specific component (Accordion, Card, Checkbox, etc.)

This ensures you use the correct props and import paths for the installed version.
