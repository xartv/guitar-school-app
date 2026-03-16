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

export async function toggleStage(stageId: string, completed: boolean) {
  await prisma.skillStage.update({
    where: { id: stageId },
    data: { completed },
  })
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
