"use server"

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
    await tx.skill.deleteMany({ where: { levelId } })
    await tx.level.delete({ where: { id: levelId } })
  })
}

export async function checkLevelCompletion(levelId: string): Promise<boolean> {
  const skills = await prisma.skill.findMany({
    where: { levelId },
    include: { stages: true },
  })

  if (skills.length === 0) return false

  return skills.every((skill) =>
    skill.stages.length > 0 && skill.stages.every((stage) => stage.completed)
  )
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
