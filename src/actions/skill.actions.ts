"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { checkLevelCompletion, createNextLevel } from "@/actions/level.actions"

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
          { stage: 4 },
        ],
      },
    },
    include: { stages: true },
  })

  return skill
}

export async function updateSkillNotes(skillId: string, notes: string) {
  await prisma.skill.update({
    where: { id: skillId },
    data: { notes },
  })
}

export async function updateSkillTempo(skillId: string, tempo: number | null) {
  if (tempo !== null && (tempo < 1 || tempo > 300 || !Number.isInteger(tempo))) {
    throw new Error("Tempo must be an integer between 1 and 300 BPM")
  }
  await prisma.skill.update({
    where: { id: skillId },
    data: { tempo },
  })
  revalidatePath("/")
}

export async function toggleStage(stageId: string, completed: boolean) {
  const stage = await prisma.skillStage.update({
    where: { id: stageId },
    data: { completed },
    select: { skill: { select: { id: true, levelId: true } } },
  })

  const { id: skillId, levelId } = stage.skill

  await checkSkillCompletion(skillId)

  const levelCompleted = await checkLevelCompletion(levelId)
  if (levelCompleted) {
    const currentLevel = await prisma.level.findUniqueOrThrow({
      where: { id: levelId },
      select: { order: true, programId: true },
    })
    const nextLevelExists = await prisma.level.findFirst({
      where: { programId: currentLevel.programId, order: { gt: currentLevel.order } },
    })
    if (!nextLevelExists) {
      await createNextLevel(levelId)
      revalidatePath("/")
    }
  }
}

export async function addYoutubeLink(skillId: string, url: string) {
  await prisma.youtubeLink.create({
    data: { skillId, url },
  })
}

export async function checkSkillCompletion(skillId: string): Promise<boolean> {
  const stages = await prisma.skillStage.findMany({
    where: { skillId },
  })

  if (stages.length === 0) return false

  const completed = stages.every((stage) => stage.completed)

  await prisma.skill.update({
    where: { id: skillId },
    data: { completed },
  })

  return completed
}

export async function deleteSkill(skillId: string) {
  await prisma.$transaction([
    prisma.skillStage.deleteMany({ where: { skillId } }),
    prisma.youtubeLink.deleteMany({ where: { skillId } }),
    prisma.skill.delete({ where: { id: skillId } }),
  ])
}
