"use server"

import { prisma } from "@/lib/prisma"

export async function createProgram(title: string) {
  const program = await prisma.program.create({
    data: { title },
  })

  return program
}

export async function getProgram() {
  const program = await prisma.program.findFirst({
    include: { levels: true },
  })

  return program
}
