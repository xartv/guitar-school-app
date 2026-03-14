# Skill: Prisma Expert

## Purpose

Write correct, safe, and efficient Prisma queries and schema changes.

## ORM Used

Prisma ORM with SQLite for MVP.

## Schema Rules

-   Use explicit relations
-   Use descriptive model names
-   Prefer `cuid()` for IDs

## Query Best Practices

-   Use `include` for related data when needed
-   Avoid unnecessary nested queries
-   Keep queries readable

Example:

``` ts
const skills = await prisma.skill.findMany({
  where: { levelId },
  include: { stages: true }
})
```

## Migration Workflow

1. Update `schema.prisma`
2. Run migration using MCP: `mcp__prisma-local__migrate-dev`
3. Check migration status: `mcp__prisma-local__migrate-status`
4. Inspect the database visually if needed: `mcp__prisma-local__Prisma-Studio`
5. Ensure application still builds

Never run `npx prisma migrate dev` via Bash — always use the MCP tool instead.

## Documentation Lookup

Before writing complex queries or schema changes, fetch up-to-date Prisma documentation:

1. `mcp__context7__resolve-library-id` with query "prisma"
2. `mcp__context7__query-docs` for the relevant topic (relations, migrations, filtering, etc.)

## Performance Guidelines

Avoid:

-   N+1 queries
-   deeply nested queries

Prefer:

-   clear relations
-   explicit includes
