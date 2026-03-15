# MVP Implementation Tasks

This document defines a step‑by‑step task list for implementing the MVP
of the Electric Guitar Practice Program App.

Guidelines for the AI agent:

-   Complete tasks **in order**
-   Each task should produce a **small, verifiable change**
-   Avoid implementing multiple unrelated systems in a single task
-   After each task - Ensure TypeScript has no errors, Ensure the app builds, Ensure code follows architecture.md, Do not implement future tasks

------------------------------------------------------------------------

# Phase 1 --- Project Setup

## Task 1 ✅

Initialize a new Next.js project with the following configuration:

-   Next.js (App Router)
-   TypeScript
-   src directory enabled
-   ESLint enabled

Verify the project runs with:

npm run dev

------------------------------------------------------------------------

## Task 2 ✅

Install core dependencies via npm:

-   prisma
-   @prisma/client
-   react-markdown

Do not configure them yet.

shadcn/ui will be initialized separately in Task 25 using `npx shadcn@latest init`.

------------------------------------------------------------------------

## Task 3 ✅

Initialize Prisma in the project.

Steps:

-   Run prisma init
-   Ensure the prisma directory is created
-   Confirm schema.prisma exists

------------------------------------------------------------------------

## Task 4 ✅

Configure Prisma to use SQLite.

Update schema.prisma datasource to:

provider = "sqlite"

Create database file:

dev.db

------------------------------------------------------------------------

## Task 5 ✅

Create the Prisma client helper.

Create file:

src/lib/prisma.ts

Export a single PrismaClient instance.

------------------------------------------------------------------------

# Phase 2 --- Database Schema

## Task 6 ✅

Add the Program model to schema.prisma.

Fields:

id\
title\
createdAt

Do not add relations yet.

------------------------------------------------------------------------

## Task 7 ✅

Run Prisma migration for the Program model.

Commands:

prisma migrate dev

Verify the table is created.

------------------------------------------------------------------------

## Task 8 ✅

Add the Level model.

Fields:

id\
title\
order\
programId\
createdAt

Add relation to Program.

------------------------------------------------------------------------

## Task 9 ✅

Run Prisma migration for Level.

Verify database structure.

------------------------------------------------------------------------

## Task 10 ✅

Add the Skill model.

Fields:

id\
title\
notes\
completed (boolean, default false)\
levelId\
createdAt

Add relation to Level.

------------------------------------------------------------------------

## Task 11 ✅

Run Prisma migration for Skill.

------------------------------------------------------------------------

## Task 12 ✅

Add the SkillStage model.

Fields:

id\
stage (number)\
completed (boolean)\
skillId

Add relation to Skill.

------------------------------------------------------------------------

## Task 13 ✅

Run Prisma migration for SkillStage.

------------------------------------------------------------------------

## Task 14 ✅

Add the YoutubeLink model.

Fields:

id\
url\
skillId

Add relation to Skill.

------------------------------------------------------------------------

## Task 15 ✅

Run Prisma migration for YoutubeLink.

------------------------------------------------------------------------

# Phase 3 --- Basic Program Flow

## Task 16 ✅

Create Server Actions folder.

src/actions

Create empty files:

program.actions.ts\
level.actions.ts\
skill.actions.ts

------------------------------------------------------------------------

## Task 17 ✅

Implement createProgram server action.

Input:

title

Behavior:

Create a Program record.

------------------------------------------------------------------------

## Task 18 ✅

Implement getProgram server action.

Behavior:

Return the first Program from the database including Levels.

------------------------------------------------------------------------

## Task 19 ✅

Update app/page.tsx to:

-   Load the program
-   If program does not exist show "Create Program" button

------------------------------------------------------------------------

## Task 20 ✅

Create a simple form to create the program.

Fields:

Program title

Submit should call createProgram action.

------------------------------------------------------------------------

# Phase 4 --- Levels

## Task 21 ✅

Create createLevel server action.

Input:

programId

Behavior:

- Determine the next order number (count existing levels + 1)
- Auto-generate title as "Level N" where N is the order number
- Insert a new Level.

------------------------------------------------------------------------

## Task 22 ✅

Create getLevels server action.

Return all levels for a program ordered by "order".

------------------------------------------------------------------------

## Task 23 ✅

Add "Add Level" button to the main page.

When clicked:

Create a new level.

------------------------------------------------------------------------

## Task 24 ✅

Render Levels as a list on the main page.

For now use simple divs.

------------------------------------------------------------------------

## Task 25

Initialize shadcn/ui using:

```
npx shadcn@latest init
```

Then install the Accordion component:

```
npx shadcn@latest add accordion
```

------------------------------------------------------------------------

## Task 26

Replace level list with Accordion UI.

Each level should be collapsible.

------------------------------------------------------------------------

# Phase 5 --- Skills

## Task 27

Create createSkill server action.

Input:

levelId title

Behavior:

Create a skill.

Automatically create 4 SkillStage records.

------------------------------------------------------------------------

## Task 28

Add "Add Skill" button inside each level.

------------------------------------------------------------------------

## Task 29

Create SkillCard component.

Props:

skill

Display:

Skill title only.

------------------------------------------------------------------------

## Task 30

Render SkillCards inside each level.

------------------------------------------------------------------------

## Task 30a

Create deleteSkill server action.

Input:

skillId

Behavior:

- Delete all SkillStage records for the skill
- Delete all YoutubeLink records for the skill
- Delete the Skill record

Use Prisma cascading delete or explicit sequential deletes.

------------------------------------------------------------------------

## Task 30b

Add delete button to SkillCard.

When clicked:

Call deleteSkill action and refresh the level.

------------------------------------------------------------------------

## Task 30c

Create deleteLevel server action.

Input:

levelId

Behavior:

- Delete all skills in the level (including their stages and youtube links)
- Delete the Level record

------------------------------------------------------------------------

## Task 30d

Add delete button to each Level in the Accordion header.

When clicked:

Call deleteLevel action and refresh the program view.

------------------------------------------------------------------------

# Phase 6 --- Skill Progress

## Task 31

Create SkillProgress component.

Display four checkboxes representing stages.

------------------------------------------------------------------------

## Task 32

Load stage data from the database.

Render correct checked state.

------------------------------------------------------------------------

## Task 33

Implement toggleStage server action.

Input:

stageId completed

Update database.

------------------------------------------------------------------------

## Task 34

Connect checkboxes to toggleStage action.

Use optimistic UI.

------------------------------------------------------------------------

# Phase 7 --- Skill Details

## Task 35

Add Notes section to SkillCard.

Render notes text.

------------------------------------------------------------------------

## Task 36

Add simple edit button for notes.

Allow updating notes text.

------------------------------------------------------------------------

## Task 37

Create addYoutubeLink server action.

Input:

skillId url

Insert new YoutubeLink.

------------------------------------------------------------------------

## Task 38

Display youtube links in SkillCard.

Render them as clickable links.

------------------------------------------------------------------------

## Task 39

Add input field to add new youtube links.

------------------------------------------------------------------------

# Phase 8 --- Completion Logic

## Task 40

Create function checkSkillCompletion.

Logic:

Skill is completed if all stages are completed.

------------------------------------------------------------------------

## Task 41

Create function checkLevelCompletion.

Logic:

Level completed if all skills completed.

------------------------------------------------------------------------

## Task 42

Create createNextLevel server action.

Behavior:

Create a new empty level.

------------------------------------------------------------------------

## Task 43

After stage toggle:

Call completion checks.

If level completed:

Automatically create next level.

------------------------------------------------------------------------

# Phase 9 --- UI Improvements

## Task 44

Style SkillCard using shadcn Card component.

------------------------------------------------------------------------

## Task 45

Add visual state for completed skills.

Example:

green border

------------------------------------------------------------------------

## Task 46

Add simple markdown rendering for notes using react-markdown.

------------------------------------------------------------------------

## Task 47

Add loading states for server actions.

------------------------------------------------------------------------

## Task 48

Ensure the UI refreshes correctly after mutations.

------------------------------------------------------------------------

# Final MVP Checklist

The MVP is complete when:

-   Program can be created
-   Levels can be added
-   Skills can be added
-   Skills contain 4 stages
-   Stage completion works
-   Notes can be edited
-   Youtube links can be added
-   New level is created automatically after completion
