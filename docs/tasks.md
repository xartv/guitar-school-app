# MVP Implementation Tasks

> **STATUS: MVP COMPLETE** — All 48 tasks have been implemented and verified (as of 2026-03-17).
> The foundation is fully built. Further work is **post-MVP feature development**.
> New tasks should be added after the existing list and should focus on enhancements,
> new features, or improvements — not on re-implementing MVP functionality.

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

## Task 25 ✅

Initialize shadcn/ui using:

```
npx shadcn@latest init
```

Then install the Accordion component:

```
npx shadcn@latest add accordion
```

------------------------------------------------------------------------

## Task 26 ✅

Replace level list with Accordion UI.

Each level should be collapsible.

------------------------------------------------------------------------

# Phase 5 --- Skills

## Task 27 ✅

Create createSkill server action.

Input:

levelId title

Behavior:

Create a skill.

Automatically create 4 SkillStage records.

------------------------------------------------------------------------

## Task 28 ✅

Add "Add Skill" button inside each level.

------------------------------------------------------------------------

## Task 29 ✅

Create SkillCard component.

Props:

skill

Display:

Skill title only.

------------------------------------------------------------------------

## Task 30 ✅

Render SkillCards inside each level.

------------------------------------------------------------------------

## Task 30a ✅

Create deleteSkill server action.

Input:

skillId

Behavior:

- Delete all SkillStage records for the skill
- Delete all YoutubeLink records for the skill
- Delete the Skill record

Use Prisma cascading delete or explicit sequential deletes.

------------------------------------------------------------------------

## Task 30b ✅

Add delete button to SkillCard.

When clicked:

Call deleteSkill action and refresh the level.

------------------------------------------------------------------------

## Task 30c ✅

Create deleteLevel server action.

Input:

levelId

Behavior:

- Delete all skills in the level (including their stages and youtube links)
- Delete the Level record

------------------------------------------------------------------------

## Task 30d ✅

Add delete button to each Level in the Accordion header.

When clicked:

Call deleteLevel action and refresh the program view.

------------------------------------------------------------------------

# Phase 6 --- Skill Progress

## Task 31 ✅

Create SkillProgress component.

Display four checkboxes representing stages.

------------------------------------------------------------------------

## Task 32 ✅

Load stage data from the database.

Render correct checked state.

------------------------------------------------------------------------

## Task 33 ✅

Implement toggleStage server action.

Input:

stageId completed

Update database.

------------------------------------------------------------------------

## Task 34 ✅

Connect checkboxes to toggleStage action.

Use optimistic UI.

------------------------------------------------------------------------

# Phase 7 --- Skill Details

## Task 35 ✅

Add Notes section to SkillCard.

Render notes text.

------------------------------------------------------------------------

## Task 36 ✅

Add simple edit button for notes.

Allow updating notes text.

------------------------------------------------------------------------

## Task 37 ✅

Create addYoutubeLink server action.

Input:

skillId url

Insert new YoutubeLink.

------------------------------------------------------------------------

## Task 38 ✅

Display youtube links in SkillCard.

Render them as clickable links.

------------------------------------------------------------------------

## Task 39 ✅

Add input field to add new youtube links.

------------------------------------------------------------------------

# Phase 8 --- Completion Logic

## Task 40 ✅

Create function checkSkillCompletion.

Logic:

Skill is completed if all stages are completed.

------------------------------------------------------------------------

## Task 41 ✅

Create function checkLevelCompletion.

Logic:

Level completed if all skills completed.

------------------------------------------------------------------------

## Task 42 ✅

Create createNextLevel server action.

Behavior:

Create a new empty level.

------------------------------------------------------------------------

## Task 43 ✅

After stage toggle:

Call completion checks.

If level completed:

Automatically create next level.

------------------------------------------------------------------------

# Phase 9 --- UI Improvements

## Task 44 ✅

Style SkillCard using shadcn Card component.

------------------------------------------------------------------------

## Task 45 ✅

Add visual state for completed skills.

Example:

green border

------------------------------------------------------------------------

## Task 46 ✅

Add simple markdown rendering for notes using react-markdown.

------------------------------------------------------------------------

## Task 47 ✅

Add loading states for server actions.

------------------------------------------------------------------------

## Task 48 ✅

Ensure the UI refreshes correctly after mutations.

------------------------------------------------------------------------

# Final MVP Checklist

> **All items below are DONE. MVP is fully implemented.**

-   ✅ Program can be created
-   ✅ Levels can be added
-   ✅ Skills can be added
-   ✅ Skills contain 4 stages
-   ✅ Stage completion works
-   ✅ Notes can be edited
-   ✅ Youtube links can be added
-   ✅ New level is created automatically after completion

------------------------------------------------------------------------

# Post-MVP Development

Future tasks should be added here. These are enhancements beyond the MVP scope.

## Task 49 ✅

Add inline editing for level titles directly in the accordion header.

Behavior:

- Hover over a level header to reveal a pencil icon button
- Click the pencil icon to enter edit mode (title replaced with an input)
- Press Enter or blur to save; press Escape to cancel
- Calls `updateLevelTitle` server action with validation and `revalidatePath`

------------------------------------------------------------------------

## Task 50 ✅

Перемести иконку галочку сворачивания=разворачивания уровня вправо, иконки редактирования и удаления должны быть слева от нее

------------------------------------------------------------------------

## Task 51 ✅

Make SkillCard collapsible (accordion-style).

The SkillCard should support a collapsed and expanded state, similar to how `LevelAccordionItem` works.

Behavior:

- By default, each SkillCard is **collapsed** — it shows only the card header row (skill title + compact progress indicator + collapse chevron).
- Clicking anywhere on the header row (or just the chevron) expands/collapses the card body.
- When **expanded**, the full card content is visible: SkillProgress, video links, notes, and the delete button.
- When **collapsed**, the header shows:
  - Skill title (left-aligned)
  - Compact progress indicator, e.g. `2/4` or filled dots/pips representing completed stages (right side, before the chevron)
  - A `ChevronDown` icon at the far right that rotates 180° when expanded
  - The delete button should remain accessible when collapsed (revealed on hover, as it is today)
- Completed skills (all 4 stages done) should show the green completed ring/border on the card regardless of collapsed/expanded state.
- The collapsed/expanded state is **local React state** only — no persistence required.

Implementation notes:

- Use the `AccordionPrimitive` from `@base-ui/react/accordion` (already installed, used in `LevelAccordion.tsx`) rather than a custom toggle, to get the animated height transition via `AccordionContent`.
- Alternatively, a simple `useState(false)` with a `max-height` CSS transition via CSS Modules is acceptable if the accordion primitive causes nesting issues (accordion inside accordion).
- The compact progress summary in the collapsed header should derive from the `stages` prop already passed to `SkillCard` — no new data fetching needed.
- Do not remove or restructure any existing server action calls (`deleteSkill`, `updateSkillNotes`, `addYoutubeLink`, `toggleStage`) — they stay inside the card body.
- The card should start **collapsed** by default so levels with many skills are not overwhelming.

------------------------------------------------------------------------

## Task 52 ✅

Add a compact progress indicator to the SkillCard collapsed header.

This is a sub-task of Task 51 that focuses on the visual design of the collapsed state summary.

Behavior:

- When the card is collapsed, display a row of 4 small stage pips (filled circle = completed, empty circle = not completed) to the left of the chevron.
- The pip style should be consistent with the existing `SkillProgress` pill style from `SkillProgress.tsx`.
- If the skill is fully completed, show a small `✓ Done` badge (similar to the level's "✓ Complete" badge in `LevelAccordionItem`) instead of or alongside the pips.
- The progress pips must be read-only in the collapsed header — clicking them should NOT toggle stages. The full interactive `SkillProgress` component is still rendered in the expanded body.

Implementation notes:

- Extract a new small presentational component `SkillProgressPips` (or similar name) that renders read-only stage indicators.
- Pass `stages` and `completed` props from `SkillCard` into this component.
- Place it in the collapsed header row, between the skill title and the chevron.
- Style with CSS Modules or Tailwind inline classes consistent with the existing `SkillProgress.module.css` visual language.

------------------------------------------------------------------------

## Task 53 ✅

Убрать отображение нумерации для уровней.

Удалить круглый бейдж с порядковым номером уровня из заголовка аккордеона.

------------------------------------------------------------------------

## Task 54 ✅

Add an optional `tempo` field (integer BPM) to the `Skill` model in Prisma schema.

Schema change:

- Add `tempo Int?` to the `Skill` model in `prisma/schema.prisma`.

Run a migration after the schema change using `mcp__prisma-local__migrate-dev` with migration name `add-skill-tempo`.

------------------------------------------------------------------------

## Task 55 ✅

Add a `updateSkillTempo` server action to `src/actions/skill.actions.ts`.

The action accepts `skillId: string` and `tempo: number | null`.

Behavior:

- Update `skill.tempo` in the database via Prisma.
- Call `revalidatePath("/")` after the update.

Input validation:

- If `tempo` is not null, it must be a positive integer (1–300 BPM). Throw a descriptive error if the value is out of range.

------------------------------------------------------------------------

## Task 56 ✅

Update the `SkillCard` component to support the tempo field.

The `skill` prop currently has the shape `{ id: string; title: string; notes: string | null }`. Extend it to also include `tempo: number | null`.

Update all call-sites that pass `skill` into `SkillCard` (typically in the Level/page render) to include the `tempo` field from the Prisma query result.

No UI changes in this task — just ensure the prop flows through without TypeScript errors and the existing UI is unaffected.

Technical notes:

- Check that Prisma queries that fetch skills already select or include `tempo`. If not, add it.
- The `SkillCard` component currently imports types from `@/generated/prisma/models/SkillStage` — follow the same pattern for the skill shape if a generated model type is available, otherwise extend the inline interface.

------------------------------------------------------------------------

## Task 57 ✅

Add tempo display and editing UI to `SkillCard`.

Behavior:

- If `skill.tempo` is `null` (no tempo set): show a small "Add tempo" toggle button in the collapsed header row, between the skill title and the progress pips. Clicking it reveals a compact inline BPM input inside the card body (not in the header).
- If `skill.tempo` is set: always display it as a read-only badge (e.g. `120 BPM`) in the collapsed header row, between the title and the progress pips. This badge must be visible even when the card is collapsed.
- When the card is expanded, the tempo section in the body shows:
  - The current BPM value with an edit (pencil) button, OR
  - An inline number input if the user is in edit mode.
  - A "Clear" button to remove the tempo (set to null).
- Saving calls `updateSkillTempo`. Use optimistic local state during the async call (show a loading indicator, disable controls).
- Cancelling edit restores the previous value.

UI / styling notes:

- The collapsed-header tempo badge should follow the same visual language as the `SkillProgressPips` component — small, muted, compact.
- The "Add tempo" button (when no tempo is set) should look like the existing "Add notes" ghost button inside the card body — text+icon, `variant="ghost"`, small size.
- The BPM number input should be narrow (e.g. `w-20`) and accept only integers. Use `type="number"` with `min=1 max=300`.
- Style the tempo section in the card body using the existing CSS Modules file (`SkillCard.module.css`) or inline Tailwind classes consistent with the rest of the card.
- Do NOT add new shadcn/ui components — use existing ones (`Button`, `Card`) and plain HTML inputs.

------------------------------------------------------------------------

Reference candidates from `docs/spec.md` section "Future Improvements":

-   Authentication
-   Multiple programs
-   Drag & drop skill ordering
-   Calendar practice tracking
-   Video embedding (YouTube player)
-   Progress dashboard
-   Statistics
-   Mobile optimization

------------------------------------------------------------------------

## Task 58 ✅

Add `RepertoireItem` and `RepertoireLink` models to the Prisma schema.

Add two new models to `prisma/schema.prisma`:

```prisma
model RepertoireItem {
  id        String           @id @default(cuid())
  title     String
  notes     String?
  completed Boolean          @default(false)
  programId String
  createdAt DateTime         @default(now())
  program   Program          @relation(fields: [programId], references: [id])
  links     RepertoireLink[]
}

model RepertoireLink {
  id               String         @id @default(cuid())
  url              String
  repertoireItemId String
  item             RepertoireItem @relation(fields: [repertoireItemId], references: [id])
}
```

Also add the back-relation `repertoireItems RepertoireItem[]` to the existing `Program` model.

Run the migration with `mcp__prisma-local__migrate-dev` using migration name `add-repertoire`.

------------------------------------------------------------------------

## Task 59 ✅

Create `src/actions/repertoire.actions.ts` with core CRUD server actions.

Add `"use server"` directive. Implement the following actions:

- `getRepertoireItems(programId: string)` — fetch all `RepertoireItem` records for the program ordered by `createdAt asc`, including their `links`
- `createRepertoireItem(programId: string, title: string)` — create a new item (trim + validate non-empty title); call `revalidatePath("/")`
- `deleteRepertoireItem(itemId: string)` — delete linked `RepertoireLink` records first (or use `prisma.$transaction`), then the item; call `revalidatePath("/")`
- `toggleRepertoireItemCompleted(itemId: string, completed: boolean)` — update `completed` field; call `revalidatePath("/")`
- `updateRepertoireItemNotes(itemId: string, notes: string)` — update `notes`; call `revalidatePath("/")`
- `addRepertoireLink(itemId: string, url: string)` — create a new `RepertoireLink`; call `revalidatePath("/")`

Follow the same patterns as `src/actions/skill.actions.ts`.

------------------------------------------------------------------------

## Task 60 ✅

Build the `RepertoireCard` client component at `src/components/RepertoireCard.tsx`.

Props:

```ts
interface RepertoireCardProps {
  item: { id: string; title: string; notes: string | null; completed: boolean }
  links: { id: string; url: string }[]
}
```

Behavior:

- Collapsible card using `useState` + CSS height transition (same pattern as `SkillCard`) — collapsed by default
- Collapsed header shows: completion checkbox (left of title), title, chevron (far right)
- Checking the checkbox calls `toggleRepertoireItemCompleted` with optimistic local state
- Completed items get the same green ring visual as `SkillCard` (`ring-completed border-transparent`)
- Expanded body shows:
  - YouTube links list + "Paste YouTube URL..." add input (same pattern as `SkillCard`)
  - Notes markdown display (`ReactMarkdown`) + "Edit notes" / "Add notes" ghost button
  - Delete button (calls `deleteRepertoireItem` then `router.refresh()`)
- Notes editing calls `updateRepertoireItemNotes` then `router.refresh()`
- Add link calls `addRepertoireLink` then `router.refresh()`

Use existing `Button`, `Card`, `CardContent` shadcn/ui components. No new shadcn components needed. Style consistently with `SkillCard` visual language using CSS Modules or inline Tailwind classes.

------------------------------------------------------------------------

## Task 61 ✅

Build `RepertoireSection` feature component and wire it into `src/app/page.tsx`.

Create `src/features/repertoire/RepertoireSection.tsx` as a client component.

Props:

```ts
interface RepertoireSectionProps {
  items: { id: string; title: string; notes: string | null; completed: boolean; links: { id: string; url: string }[] }[]
  programId: string
}
```

Behavior:

- Displays an "Add Song" button; clicking reveals an inline text input + confirm button
- Submitting calls `createRepertoireItem(programId, title)`; on success clears input and calls `router.refresh()`
- Renders a list of `RepertoireCard` components for each item
- If no items exist, shows an empty-state message styled consistently with the existing levels empty state

Update `src/app/page.tsx`:

- Call `getRepertoireItems(program.id)` alongside `getLevels` (both at the top of the Server Component)
- Render a new section below `<LevelAccordion>` with a heading ("Repertoire") using the same typographic style as the program title block
- Render `<RepertoireSection items={repertoireItems} programId={program.id} />` inside that section
- Only show the repertoire section when a program exists
