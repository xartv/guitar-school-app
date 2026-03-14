# Skill: Code Review

## Purpose

Review generated code to ensure quality and architectural consistency.

## How to Trigger

This skill is executed via the **`feature-code-reviewer`** agent — not manually by the main agent.

After implementing a task, the main agent must launch the `feature-code-reviewer` agent and pass it context about what was implemented. The main agent then waits for the review result and fixes all raised issues before proceeding to QA.

## Review Checklist

### Architecture

Ensure code follows:

-   docs/architecture.md
-   Server Actions pattern
-   Prisma usage rules

### Type Safety

Check:

-   TypeScript types
-   proper interfaces
-   no `any` usage unless justified

### Component Design

Ensure:

-   components are small
-   clear props
-   separation of concerns

### Performance

Check for:

-   unnecessary re-renders
-   inefficient queries
-   large components

### Readability

Ensure:

-   descriptive naming
-   clear structure
-   minimal complexity

## Output Format

When performing a review:

1.  List detected issues
2.  Suggest improvements
3.  Provide corrected code when necessary
