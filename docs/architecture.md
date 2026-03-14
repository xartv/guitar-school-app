# Architecture Specification

## Tech Stack

-   Next.js (App Router)
-   TypeScript
-   Prisma ORM
-   SQLite (MVP database)
-   shadcn/ui for UI components
-   CSS Modules for styling

Future database options: - PostgreSQL - Supabase

------------------------------------------------------------------------

## Architectural Principles

The architecture is intentionally simple to work well with AI-assisted
development.

Principles:

-   Use **Server Actions instead of API routes**
-   Use **Prisma as the only database access layer**
-   Use **feature-based folder structure**
-   Avoid complex state management libraries, until there is a need for it
-   Use **local React state for UI interactions**
-   Use **optimistic UI updates** where possible

------------------------------------------------------------------------

## State Management Rules

For the MVP, avoid introducing additional state management libraries.

Do not introduce:

- Zustand
- React Query
- Redux

unless explicitly required.

The MVP should rely on:

- Server Actions
- Prisma
- local React state

These libraries may be introduced later if the application grows and requires:

- complex client-side state
- realtime data synchronization
- background data fetching

------------------------------------------------------------------------

## Folder Structure

src/

app/ layout.tsx\
page.tsx

actions/\
program.actions.ts\
level.actions.ts\
skill.actions.ts

features/\
program/\
levels/\
skills/

entities/\
program/\
level/\
skill/

components/\
ui/

lib/\
prisma.ts\
utils.ts

prisma/\
schema.prisma

types/

------------------------------------------------------------------------

## Entities (Domain Types)

Entities represent pure data structures separated from UI components.

Example:

entities/skill/types.ts

``` ts
export interface Skill {
  id: string
  title: string
  notes?: string
  completed: boolean
  levelId: string
  stages: SkillStage[]
  links: YoutubeLink[]
}

export interface SkillStage {
  id: string
  stage: number
  completed: boolean
}

export interface YoutubeLink {
  id: string
  url: string
}
```

Separating types from UI helps AI agents reason about the domain model.

------------------------------------------------------------------------

## Server Actions

All database mutations should be implemented as **Server Actions**.

Example:

actions/skill.actions.ts

``` ts
"use server"

import { prisma } from "@/lib/prisma"

export async function createSkill(levelId: string, title: string) {
  const skill = await prisma.skill.create({
    data: {
      title,
      levelId,
      stages: {
        create: [
          { stage: 1 },
          { stage: 2 },
          { stage: 3 },
          { stage: 4 }
        ]
      }
    }
  })

  return skill
}
```

------------------------------------------------------------------------

## Updating Skill Progress

Example of toggling a stage:

``` ts
export async function toggleStage(stageId: string, completed: boolean) {
  await prisma.skillStage.update({
    where: { id: stageId },
    data: { completed }
  })
}
```

------------------------------------------------------------------------

## Level Completion Logic

When a stage is updated:

toggleStage\
↓\
checkSkillCompleted\
↓\
checkLevelCompleted\
↓\
createNextLevel

Example logic:

``` ts
async function checkLevelCompletion(levelId: string) {
  const skills = await prisma.skill.findMany({
    where: { levelId },
    include: { stages: true }
  })

  const allCompleted = skills.every(skill =>
    skill.stages.every(stage => stage.completed)
  )

  if (allCompleted) {
    await createNextLevel(levelId)
  }
}
```

------------------------------------------------------------------------

## Optimistic UI

To keep the interface responsive, UI state updates immediately and then
syncs with the server.

Example:

``` ts
const [completed, setCompleted] = useState(stage.completed)

async function handleToggle() {
  setCompleted(!completed)

  await toggleStage(stage.id, !completed)
}
```

------------------------------------------------------------------------

## Prisma Client

Database client configuration.

lib/prisma.ts

``` ts
import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient()
```

------------------------------------------------------------------------

## Data Flow

UI Component\
↓\
Server Action\
↓\
Prisma ORM\
↓\
Database

This architecture keeps the system simple and predictable for AI agents.

------------------------------------------------------------------------

## Future Architecture Evolution

This project may evolve into a multi-user platform.

In the future it may introduce:

- Zustand for complex client-side state (e.g. metronome, timers)
- React Query for complex server state management

However these libraries should not be introduced during the MVP stage.
