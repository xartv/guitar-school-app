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

------------------------------------------------------------------------

## Task 62

Remove `tempo Int?` from the `Skill` model and add a new `TempoEntry` model to `prisma/schema.prisma`.

Schema changes:

- Remove the `tempo Int?` field from the `Skill` model.
- Add the back-relation `tempoEntries TempoEntry[]` to the `Skill` model.
- Add a new model:

```prisma
model TempoEntry {
  id         String  @id @default(cuid())
  quarterBpm Int
  skillId    String
  skill      Skill   @relation(fields: [skillId], references: [id], onDelete: Cascade)
}
```

Run the migration with `mcp__prisma-local__migrate-dev` using migration name `add-tempo-entries`.

Technical notes: `onDelete: Cascade` on the `skill` relation ensures `TempoEntry` rows are automatically deleted when their parent `Skill` is deleted — no manual deletion logic needs to be added to `deleteSkill`.

------------------------------------------------------------------------

## Task 63

Replace the `updateSkillTempo` server action with `createTempoEntry` and `deleteTempoEntry` in `src/actions/skill.actions.ts`.

- Remove the `updateSkillTempo` function entirely.
- Add `createTempoEntry(skillId: string, quarterBpm: number)`:
  - Validate `quarterBpm` is a positive integer in the range 1–300. Throw a descriptive error if invalid.
  - Create a `TempoEntry` record via Prisma.
  - Call `revalidatePath("/")`.
  - Return the created record.
- Add `deleteTempoEntry(entryId: string)`:
  - Delete the `TempoEntry` by id via Prisma.
  - Call `revalidatePath("/")`.

Technical notes: The 1–300 validation range applies to the quarter-note BPM base value only. Derived column values shown in the UI may exceed 300 — those are computed client-side and never stored.

------------------------------------------------------------------------

## Task 64

Build the `TempoTable` client component at `src/components/TempoTable/TempoTable.tsx` (with `TempoTable.module.css`).

Props:

```ts
interface TempoTableProps {
  skillId: string
  entries: { id: string; quarterBpm: number }[]
}
```

Note duration divisions: 1/4→1, 1/8→2, 1/16→4, 1/12→3, 1/24→6.

Behavior:

- Renders a table with 5 columns: 1/4, 1/8, 1/16, 1/12, 1/24.
- Each existing entry renders as a row. Cell value for column X = `Math.round(entry.quarterBpm * divisions[X])`. Each row has a delete button that calls `deleteTempoEntry(entry.id)` then `router.refresh()`.
- Below the rows: an "add" input row with one editable cell at a time. The user types a BPM into any column cell. The other 4 cells update instantly (local state only). On confirm (Enter or "+ Add" button), derive `quarterBpm = Math.round(enteredBpm / divisions[enteredCol])`, call `createTempoEntry(skillId, quarterBpm)`, then `router.refresh()`.
- If no entries and the add row is not open, show a compact "Add tempo" ghost button that reveals the add row.
- Disable controls and show a spinner during async create/delete operations.

Technical notes: All conversion math is client-side only. Use CSS Modules for table layout. Keep async handlers internal to the component via `useState`.

------------------------------------------------------------------------

## Task 65

Wire `TempoTable` into `SkillCard` and update all data fetching call-sites.

Changes to `src/components/SkillCard.tsx`:

- Remove all tempo-related state variables (`tempo`, `isEditingTempo`, `tempoInput`, `isTempoOpen`, `isTempoLoading`, `tempoError`), all tempo handler functions (`handleSaveTempo`, `handleClearTempo`, `handleCancelTempo`), the `tempoBadge` in the collapsed header, and the entire tempo JSX section in the card body.
- Remove the `updateSkillTempo` import.
- Update `SkillCardProps`: remove `tempo: number | null` from the `skill` shape; add `tempoEntries: { id: string; quarterBpm: number }[]` as a top-level prop.
- In the card body (expanded section), replace the removed tempo block with `<TempoTable skillId={skill.id} entries={tempoEntries} />`. Position it after the notes section.
- In the collapsed header: if `tempoEntries.length > 0`, show a compact summary badge (e.g. `♩ N` or `N tempos`) in place of the old `tempoBadge`. If empty, show nothing.

Update Prisma query call-sites that fetch skills to include `tempoEntries: true` in the `include` block. Check `src/app/page.tsx` and `src/features/levels/LevelAccordion.tsx` (or wherever skills are queried).

After this task, run `npm run build` to confirm no TypeScript errors remain.

------------------------------------------------------------------------

# Phase: Authentication

## Task 66 ✅

Add the `User` model to `prisma/schema.prisma` and link `Program` to `User` (1:1).

Schema changes:

- Add a new model:

```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  program      Program?
}
```

- Add `userId String @unique` and `user User @relation(fields: [userId], references: [id])` to the `Program` model.

Run the migration with `mcp__prisma-local__migrate-dev` using migration name `add-user-auth`.

Technical notes:

- `Program.userId` is `@unique` to enforce the 1:1 relationship — each user has at most one program.
- `passwordHash` stores a bcrypt hash; the plain-text password is never stored.
- The existing single `Program` row in the database has no `userId` yet. The migration must handle this: either mark `userId` as optional (`String?`) for the migration and tighten it later, or reset the development database first (`mcp__prisma-local__migrate-reset` after confirming with the user). Discuss with the user before choosing.

------------------------------------------------------------------------

## Task 67 ✅

Install authentication dependencies.

Install the following packages:

```
npm install next-auth@beta bcryptjs
npm install --save-dev @types/bcryptjs
```

**Library choice rationale — NextAuth.js v5 (Auth.js beta):**

- Designed specifically for Next.js App Router: ships a first-class `auth()` helper that works directly in Server Components and Server Actions, eliminating the need for manual JWT parsing.
- Handles session cookies, CSRF protection, and redirect flows out of the box — no custom middleware logic needed.
- The `CredentialsProvider` supports email/password auth without OAuth.
- JWT sessions (stateless, stored in a signed httpOnly cookie) are used — no additional database session table is required.
- Alternative considered: `jose` (raw JWT). It is lighter but requires manually implementing cookie management, CSRF, and redirect flows — significant boilerplate that NextAuth handles automatically. Not worth the trade-off here.

After installing, verify `npm run build` still succeeds (the lib has no configuration yet, so no errors expected at this step).

------------------------------------------------------------------------

## Task 68 ✅

Create the NextAuth configuration at `src/auth.ts`.

This file is the single source of truth for the auth instance.

```ts
// src/auth.ts
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // validate, find user, compare hash — return user object or null
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      return session
    },
  },
})
```

Add the route handler at `src/app/api/auth/[...nextauth]/route.ts`:

```ts
import { handlers } from "@/auth"
export const { GET, POST } = handlers
```

Technical notes:

- The `authorize` callback must fetch the user by email, compare the submitted password against `passwordHash` using `bcrypt.compare`, and return `{ id, email }` on success or `null` on failure.
- The `jwt` and `session` callbacks inject `user.id` into the session so Server Actions can read it via `auth()`.
- Add a `next-auth.d.ts` type augmentation file to extend `Session` and `JWT` with the `id` field.
- Note: this is the only place in the project where an API route (`/api/auth/[...nextauth]`) is used — it is required by NextAuth's internal redirect/callback mechanism and is not a custom data API route.

------------------------------------------------------------------------

## Task 69 ✅

Create Server Actions for registration and login in `src/actions/auth.actions.ts`.

```ts
"use server"

export async function registerUser(email: string, password: string): Promise<void>
export async function loginUser(email: string, password: string): Promise<void>
export async function logoutUser(): Promise<void>
```

Behavior:

- `registerUser`:
  - Validate email format and non-empty password (min 6 characters).
  - Check that no `User` with this email already exists; throw a descriptive error if so.
  - Hash the password with `bcrypt.hash(password, 12)`.
  - Create the `User` record in Prisma (no `Program` created here — the user creates their own program after login, as today).
  - Call `signIn("credentials", { email, password, redirectTo: "/" })` from `src/auth.ts` to log the user in immediately after registration.
- `loginUser`:
  - Call `signIn("credentials", { email, password, redirectTo: "/" })`.
  - NextAuth's `authorize` callback handles validation internally; if credentials are wrong, `signIn` throws a `CredentialsSignin` error — catch it and re-throw with a user-friendly message.
- `logoutUser`:
  - Call `signOut({ redirectTo: "/login" })` from `src/auth.ts`.

Technical notes:

- All three functions are Server Actions (`"use server"` at top of file).
- `signIn` and `signOut` from NextAuth v5 can be called directly from Server Actions — no client redirect needed.
- Do NOT use `revalidatePath` here; the redirectTo in signIn/signOut handles navigation.

------------------------------------------------------------------------

## Task 70 ✅

Build the `/login` page at `src/app/login/page.tsx`.

This is a Server Component page that renders a `LoginForm` client component.

`LoginForm` behavior:

- Fields: Email (type="email"), Password (type="password")
- Submit button: "Sign in"
- On submit, calls the `loginUser` Server Action.
- Displays an inline error message if the action throws (e.g. "Invalid email or password").
- Shows a loading/disabled state while the action is pending (use `useActionState` or `useTransition`).
- Below the form: "Don't have an account? Register" link pointing to `/register`.

Visual style:

- Centered card layout (max-w-sm, centered with flex min-h-screen).
- Use `Card`, `CardHeader`, `CardContent` from shadcn/ui.
- Heading: "Sign in to Guitar Practice Program".
- Consistent with the existing app visual language (same font, colors, border-radius).

Technical notes:

- The page at `/login` must NOT be protected by the auth middleware — it must be publicly accessible.
- No redirect from this page if already logged in (keep it simple for now).

------------------------------------------------------------------------

## Task 71 ✅

Build the `/register` page at `src/app/register/page.tsx`.

This is a Server Component page that renders a `RegisterForm` client component.

`RegisterForm` behavior:

- Fields: Email (type="email"), Password (type="password"), Confirm Password (type="password")
- Submit button: "Create account"
- Client-side validation: passwords must match before submitting; show an inline error if not.
- On submit, calls the `registerUser` Server Action.
- Displays an inline error message if the action throws (e.g. "Email already registered").
- Shows a loading/disabled state while the action is pending.
- Below the form: "Already have an account? Sign in" link pointing to `/login`.

Visual style:

- Same centered card layout as `/login`.
- Heading: "Create your account".

------------------------------------------------------------------------

## Task 72 ✅

Protect the main page (`/`) with an auth guard.

Create `src/middleware.ts` using NextAuth's built-in middleware:

```ts
export { auth as middleware } from "@/auth"

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|register).*)"],
}
```

Behavior:

- Any unauthenticated request to `/` (or any future protected route) is automatically redirected to `/login`.
- The `/login` and `/register` routes remain publicly accessible.
- API routes (including `/api/auth/...`) are excluded from the matcher.

Technical notes:

- This is the minimal middleware approach recommended by NextAuth v5 — no custom logic needed.
- Verify that after implementing this task, opening `http://localhost:3000` while unauthenticated redirects to `/login`.

------------------------------------------------------------------------

## Task 73 ✅

Isolate all data by `userId` — update `getProgram` and `createProgram` server actions to scope to the authenticated user.

Changes to `src/actions/program.actions.ts`:

- In `getProgram`: call `auth()` from `src/auth.ts` to get the current session. Extract `session.user.id`. Query `prisma.program.findFirst({ where: { userId: session.user.id }, include: { levels: true } })`. If no session exists, return `null`.
- In `createProgram`: call `auth()` to get the session; throw if unauthenticated. Pass `userId: session.user.id` in the `prisma.program.create` data object.

No changes are needed to any other actions (`level.actions.ts`, `skill.actions.ts`, `repertoire.actions.ts`) because they all operate on IDs derived from the already-scoped `Program` or `Level` — the data isolation chain is: `User → Program → Level → Skill`. A user who does not own a `programId` cannot obtain it from `getProgram`, so lower-level actions are implicitly isolated.

Technical notes:

- `auth()` in a Server Action returns the session or `null`.
- After this change, the existing `Program` row in the database has no `userId` — it will no longer appear for any logged-in user (which is fine for a fresh development database).

------------------------------------------------------------------------

## Task 74 ✅

Add a user header bar to the main page — display the current user's email and a "Sign out" button.

Changes to `src/app/page.tsx`:

- Call `auth()` from `src/auth.ts` at the top of the Server Component to get the session.
- In the sticky header, add a right-aligned section showing:
  - The user's email in a small muted text (`text-sm text-muted-foreground`).
  - A "Sign out" ghost button that calls `logoutUser` from `src/actions/auth.actions.ts` via a `<form action={logoutUser}>` or a small `SignOutButton` client component.

`SignOutButton` (if client component needed):

- A `<Button variant="ghost" size="sm">` that on click calls `logoutUser()` via a transition.
- Can be a small inline client component in `src/features/auth/SignOutButton.tsx`.

Visual placement:

- Right side of the existing header row (use `ml-auto` or `justify-between` on the header flex container).
- Compact: email + sign-out button should not overwhelm the header.

------------------------------------------------------------------------

