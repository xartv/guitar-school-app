"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function createProgram(title: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")

  const program = await prisma.program.create({
    data: { title, userId: session.user.id },
  })

  return program
}

export async function getProgram() {
  const session = await auth()
  if (!session?.user?.id) return null

  const program = await prisma.program.findFirst({
    where: { userId: session.user.id },
    include: { levels: true },
  })

  return program
}
