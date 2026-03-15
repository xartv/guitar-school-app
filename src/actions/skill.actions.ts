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
