"use server"

import { prisma } from "@/lib/prisma"

// userId will be replaced by auth() session in Task 73
export async function createProgram(title: string, userId?: string) {
  const program = await prisma.program.create({
    data: { title, userId: userId ?? "" },
  })

  return program
}

export async function getProgram() {
  const program = await prisma.program.findFirst({
    include: { levels: true },
  })

  return program
}
