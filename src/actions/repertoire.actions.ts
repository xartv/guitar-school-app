"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

async function getSessionUserId(): Promise<string> {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")
  return session.user.id
}

async function assertProgramOwnership(programId: string, userId: string): Promise<void> {
  const program = await prisma.program.findUnique({
    where: { id: programId },
    select: { userId: true },
  })
  if (!program || program.userId !== userId) throw new Error("Not found")
}

async function assertRepertoireItemOwnership(itemId: string, userId: string): Promise<void> {
  const item = await prisma.repertoireItem.findUnique({
    where: { id: itemId },
    select: { program: { select: { userId: true } } },
  })
  if (!item || item.program.userId !== userId) throw new Error("Not found")
}

async function assertRepertoireLinkOwnership(linkId: string, userId: string): Promise<void> {
  const link = await prisma.repertoireLink.findUnique({
    where: { id: linkId },
    select: { item: { select: { program: { select: { userId: true } } } } },
  })
  if (!link || link.item.program.userId !== userId) throw new Error("Not found")
}

export async function getRepertoireItems(programId: string) {
  const session = await auth()
  if (!session?.user?.id) return []
  const program = await prisma.program.findUnique({
    where: { id: programId, userId: session.user.id },
  })
  if (!program) return []

  return prisma.repertoireItem.findMany({
    where: { programId },
    orderBy: { createdAt: "asc" },
    include: { links: true },
  })
}

export async function createRepertoireItem(programId: string, title: string) {
  const userId = await getSessionUserId()
  await assertProgramOwnership(programId, userId)

  const trimmed = title.trim()
  if (!trimmed) throw new Error("Title cannot be empty")

  await prisma.repertoireItem.create({
    data: { programId, title: trimmed },
  })

  revalidatePath("/")
}

export async function deleteRepertoireItem(itemId: string) {
  const userId = await getSessionUserId()
  await assertRepertoireItemOwnership(itemId, userId)

  await prisma.$transaction([
    prisma.repertoireLink.deleteMany({ where: { repertoireItemId: itemId } }),
    prisma.repertoireItem.delete({ where: { id: itemId } }),
  ])

  revalidatePath("/")
}

export async function toggleRepertoireItemCompleted(itemId: string, completed: boolean) {
  const userId = await getSessionUserId()
  await assertRepertoireItemOwnership(itemId, userId)

  await prisma.repertoireItem.update({
    where: { id: itemId },
    data: { completed },
  })

  revalidatePath("/")
}

export async function updateRepertoireItemNotes(itemId: string, notes: string) {
  const userId = await getSessionUserId()
  await assertRepertoireItemOwnership(itemId, userId)

  await prisma.repertoireItem.update({
    where: { id: itemId },
    data: { notes },
  })

  revalidatePath("/")
}

export async function addRepertoireLink(itemId: string, url: string) {
  const userId = await getSessionUserId()
  await assertRepertoireItemOwnership(itemId, userId)

  await prisma.repertoireLink.create({
    data: { repertoireItemId: itemId, url },
  })

  revalidatePath("/")
}

export async function deleteRepertoireLink(linkId: string) {
  const userId = await getSessionUserId()
  await assertRepertoireLinkOwnership(linkId, userId)

  await prisma.repertoireLink.delete({ where: { id: linkId } })
  revalidatePath("/")
}
