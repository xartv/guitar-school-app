import { prisma } from "@/lib/prisma"

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
