"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

export async function getRepertoireItems(programId: string) {
  return prisma.repertoireItem.findMany({
    where: { programId },
    orderBy: { createdAt: "asc" },
    include: { links: true },
  })
}

export async function createRepertoireItem(programId: string, title: string) {
  const trimmed = title.trim()
  if (!trimmed) throw new Error("Title cannot be empty")

  await prisma.repertoireItem.create({
    data: { programId, title: trimmed },
  })

  revalidatePath("/")
}

export async function deleteRepertoireItem(itemId: string) {
  await prisma.$transaction([
    prisma.repertoireLink.deleteMany({ where: { repertoireItemId: itemId } }),
    prisma.repertoireItem.delete({ where: { id: itemId } }),
  ])

  revalidatePath("/")
}

export async function toggleRepertoireItemCompleted(itemId: string, completed: boolean) {
  await prisma.repertoireItem.update({
    where: { id: itemId },
    data: { completed },
  })

  revalidatePath("/")
}

export async function updateRepertoireItemNotes(itemId: string, notes: string) {
  await prisma.repertoireItem.update({
    where: { id: itemId },
    data: { notes },
  })

  revalidatePath("/")
}

export async function addRepertoireLink(itemId: string, url: string) {
  await prisma.repertoireLink.create({
    data: { repertoireItemId: itemId, url },
  })

  revalidatePath("/")
}
