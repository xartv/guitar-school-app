# Electric Guitar Practice Program App --- Project Specification

## 1. Project Overview

This project is a personal learning management application for
practicing electric guitar.

The application allows a user to create a practice program composed of
multiple levels. Each level contains skills, and each skill tracks
learning progress through four stages.

The application is intended for single-user usage (no authentication in
MVP).

Primary goals: - Learn AI‑assisted development - Experiment with
agent-driven coding - Build a structured guitar practice tracking system

------------------------------------------------------------------------

## 2. Core Concepts

Program is the root container of the learning structure.

Program ├── Level │ ├── Skill │ │ ├── Notes (markdown) │ │ ├── YouTube
links │ │ └── Progress (4 stages)

Only one program exists in MVP.

------------------------------------------------------------------------

## 3. Learning Model

### Levels

Levels represent difficulty stages in the program.

Example:

Level 1 --- Beginner Techniques\
Level 2 --- Intermediate Techniques\
Level 3 --- Advanced Techniques

Levels can be: - created manually - automatically created when the last
skill of a level is completed

------------------------------------------------------------------------

### Skills

Skills represent practice topics.

Examples:

-   Alternate Picking
-   Palm Muting
-   Power Chords
-   Legato
-   Sweep Picking

Each skill includes:

-   title
-   markdown notes
-   youtube links (array)
-   progress stages

------------------------------------------------------------------------

## 4. Skill Progress Model

Each skill has four progress stages.

Stage 1\
Stage 2\
Stage 3\
Stage 4

Each stage represents approximately one week of practice, but the app
does not enforce dates.

User manually checks completion.

Example:

\[✓\] Stage 1\
\[✓\] Stage 2\
\[ \] Stage 3\
\[ \] Stage 4

------------------------------------------------------------------------

### Skill Completion Rule

A skill is considered completed when all four stages are completed.

------------------------------------------------------------------------

### Level Completion Rule

When all skills in a level are completed:

→ Automatically create a new level

Example:

Level 2 completed → Level 3 created automatically

The new level is created empty.

------------------------------------------------------------------------

## 5. Tech Stack

Frontend framework: - Next.js (App Router)

Language: - TypeScript

UI Components: - shadcn/ui

Styling: - CSS Modules

Database ORM: - Prisma

Database (MVP): - SQLite

Future database options: - PostgreSQL - Supabase

------------------------------------------------------------------------

## 6. Application Architecture

Feature‑based architecture.

/app\
/components\
/features\
/entities\
/lib\
/prisma\
/types

------------------------------------------------------------------------

## 7. Folder Structure

All application code lives inside `src/`. Config files, docs, and other auxiliary files live at the project root alongside `src/`.

src/
  app/ page.tsx layout.tsx
  components/ ui/
  features/ program/ levels/ skills/
  entities/ program/ level/ skill/
  lib/ prisma.ts
  actions/ program.actions.ts level.actions.ts skill.actions.ts
  types/ index.ts

prisma/ schema.prisma (at project root level, alongside src/)

------------------------------------------------------------------------

## 8. Database Schema (Prisma)

``` prisma
model Program {
  id        String   @id @default(cuid())
  title     String
  levels    Level[]
  createdAt DateTime @default(now())
}

model Level {
  id        String  @id @default(cuid())
  title     String
  order     Int
  program   Program @relation(fields: [programId], references: [id])
  programId String

  skills    Skill[]

  createdAt DateTime @default(now())
}

model Skill {
  id        String  @id @default(cuid())
  title     String
  notes     String?
  completed Boolean @default(false)

  level     Level   @relation(fields: [levelId], references: [id])
  levelId   String

  stages    SkillStage[]
  links     YoutubeLink[]

  createdAt DateTime @default(now())
}

model SkillStage {
  id        String  @id @default(cuid())
  stage     Int
  completed Boolean @default(false)

  skill     Skill   @relation(fields: [skillId], references: [id])
  skillId   String
}

model YoutubeLink {
  id        String @id @default(cuid())
  url       String

  skill     Skill  @relation(fields: [skillId], references: [id])
  skillId   String
}
```

------------------------------------------------------------------------

## 9. Main UI Layout

Program

├── Level 1 (accordion) │ ├── Skill Card │ ├── Skill Card │ ├── Level 2
│ ├── Skill Card

Levels are collapsible accordions.

------------------------------------------------------------------------

## 10. Core UI Components

### LevelAccordion

Displays:

-   Level title
-   Add skill button
-   Skill list

------------------------------------------------------------------------

### SkillCard

Displays:

-   Skill title
-   Edit button
-   Notes (markdown)
-   Youtube links (multiple)
-   Progress stages

Example:

\[ \] Stage 1\
\[ \] Stage 2\
\[ \] Stage 3\
\[ \] Stage 4

------------------------------------------------------------------------

### SkillProgress

Component responsible for stage checkboxes and progress state.

------------------------------------------------------------------------

## 11. Core Features

### Create Program

If program does not exist:

Show "Create Program" screen.

------------------------------------------------------------------------

### Add Level

User can manually create a level.

Level title is auto-generated as "Level N" where N is the next order number.

------------------------------------------------------------------------

### Add Skill

Inside a level user can add skills.

### Delete Skill

User can delete a skill. Deleting a skill removes all its stages and youtube links.

### Delete Level

User can delete a level. Deleting a level removes all its skills, their stages, and youtube links.

------------------------------------------------------------------------

### Edit Skill

Editable fields:

-   title
-   notes (markdown)
-   youtube links
-   progress stages

------------------------------------------------------------------------

### Add YouTube Link

Multiple links allowed per skill.

------------------------------------------------------------------------

### Markdown Notes

Skill notes support Markdown formatting.

------------------------------------------------------------------------

## 12. Business Logic

### Complete Stage

When stage checkbox is clicked:

stage.completed = true

------------------------------------------------------------------------

### Complete Skill

If all stages are completed:

skill.completed = true

This field is stored in the database (not computed on the fly).

------------------------------------------------------------------------

### Auto Create Level

When all skills in a level are completed:

create a new empty level automatically.

------------------------------------------------------------------------

## 13. MVP Screens

Screen 1 --- Create Program\
Screen 2 --- Program overview (levels accordion)\
Screen 3 --- Skill card

------------------------------------------------------------------------

## 14. Future Improvements

Possible future features:

-   Authentication
-   Multiple programs
-   Drag & drop skill ordering
-   Calendar practice tracking
-   Video embedding
-   Progress dashboard
-   Statistics
-   Mobile optimization

------------------------------------------------------------------------

## 15. Development Priorities

Step 1 --- Project setup - Next.js - Prisma - SQLite - shadcn

Step 2 --- Database schema

Step 3 --- Program creation flow

Step 4 --- Level accordion UI

Step 5 --- Skill creation

Step 6 --- Skill progress system

Step 7 --- Auto level creation
