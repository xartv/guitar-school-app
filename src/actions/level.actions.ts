"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

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

export async function checkLevelCompletion(levelId: string): Promise<boolean> {
  const skills = await prisma.skill.findMany({
    where: { levelId },
    select: { completed: true },
  })

  if (skills.length === 0) return false

  return skills.every((skill) => skill.completed)
}

export async function createNextLevel(levelId: string) {
  const level = await prisma.level.findUniqueOrThrow({
    where: { id: levelId },
    select: { programId: true },
  })

  const maxOrder = await prisma.level.aggregate({
    where: { programId: level.programId },
    _max: { order: true },
  })
  const order = (maxOrder._max.order ?? 0) + 1

  return prisma.level.create({
    data: {
      title: `Level ${order}`,
      order,
      programId: level.programId,
    },
  })
}

export async function updateLevelTitle(levelId: string, title: string) {
  const trimmed = title.trim()
  if (!trimmed || trimmed.length > 200) return
  await prisma.level.update({
    where: { id: levelId },
    data: { title: trimmed },
  })
  revalidatePath("/")
}

export async function createLevel(programId: string) {
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
