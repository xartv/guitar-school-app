"use server"

import { prisma } from "@/lib/prisma"

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
