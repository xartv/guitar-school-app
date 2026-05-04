"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

async function getSessionUserId(): Promise<string> {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")
  return session.user.id
}

async function assertLevelOwnership(levelId: string, userId: string): Promise<void> {
  const level = await prisma.level.findUnique({
    where: { id: levelId },
    select: { program: { select: { userId: true } } },
  })
  if (!level || level.program.userId !== userId) throw new Error("Not found")
}

async function assertProgramOwnership(programId: string, userId: string): Promise<void> {
  const program = await prisma.program.findUnique({
    where: { id: programId },
    select: { userId: true },
  })
  if (!program || program.userId !== userId) throw new Error("Not found")
}

export async function getLevels(programId: string) {
  const levels = await prisma.level.findMany({
    where: { programId },
    orderBy: { order: "asc" },
    include: {
      skills: {
        orderBy: { createdAt: "asc" },
        include: {
          stages: { orderBy: { stage: "asc" } },
          links: true,
          tempoEntries: { orderBy: { createdAt: "asc" } },
        },
      },
    },
  })

  return levels
}

export async function deleteLevel(levelId: string) {
  const userId = await getSessionUserId()
  await assertLevelOwnership(levelId, userId)

  await prisma.$transaction(async (tx) => {
    const skills = await tx.skill.findMany({
      where: { levelId },
      select: { id: true },
    })
    const skillIds = skills.map((s) => s.id)

    await tx.skillStage.deleteMany({ where: { skillId: { in: skillIds } } })
    await tx.youtubeLink.deleteMany({ where: { skillId: { in: skillIds } } })
    await tx.tempoEntry.deleteMany({ where: { skillId: { in: skillIds } } })
    await tx.skill.deleteMany({ where: { levelId } })
    await tx.level.delete({ where: { id: levelId } })
  })
}

export async function updateLevelTitle(levelId: string, title: string) {
  const userId = await getSessionUserId()
  await assertLevelOwnership(levelId, userId)

  const trimmed = title.trim()
  if (!trimmed || trimmed.length > 200) return
  await prisma.level.update({
    where: { id: levelId },
    data: { title: trimmed },
  })
  revalidatePath("/")
}

export async function createLevel(programId: string) {
  const userId = await getSessionUserId()
  await assertProgramOwnership(programId, userId)

  const count = await prisma.level.count({ where: { programId } })
  const order = count + 1

  const level = await prisma.level.create({
    data: {
      title: `Level ${order}`,
      order,
      programId,
    },
  })

  return level
}
