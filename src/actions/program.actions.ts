"use server"

import { prisma } from "@/lib/prisma"

export async function createProgram(title: string) {
  const program = await prisma.program.create({
    data: { title },
  })

  return program
}
