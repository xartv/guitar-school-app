"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { checkLevelCompletion, createNextLevel, checkSkillCompletion } from "@/actions/_internal"
import { auth } from "@/auth"

async function getSessionUserId(): Promise<string> {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")
  return session.user.id
}

async function assertLevelOwnership(levelId: string, userId: string): Promise<void> {
  const level = await prisma.level.findUnique({
    where: { id: levelId },
    select: { program: { select: { userId: true } } },
  })
  if (!level || level.program.userId !== userId) throw new Error("Not found")
}

async function assertSkillOwnership(skillId: string, userId: string): Promise<void> {
  const skill = await prisma.skill.findUnique({
    where: { id: skillId },
    select: { level: { select: { program: { select: { userId: true } } } } },
  })
  if (!skill || skill.level.program.userId !== userId) throw new Error("Not found")
}

async function assertStageOwnership(stageId: string, userId: string): Promise<void> {
  const stage = await prisma.skillStage.findUnique({
    where: { id: stageId },
    select: { skill: { select: { level: { select: { program: { select: { userId: true } } } } } } },
  })
  if (!stage || stage.skill.level.program.userId !== userId) throw new Error("Not found")
}

async function assertYoutubeLinkOwnership(linkId: string, userId: string): Promise<void> {
  const link = await prisma.youtubeLink.findUnique({
    where: { id: linkId },
    select: { skill: { select: { level: { select: { program: { select: { userId: true } } } } } } },
  })
  if (!link || link.skill.level.program.userId !== userId) throw new Error("Not found")
}

async function assertTempoEntryOwnership(entryId: string, userId: string): Promise<void> {
  const entry = await prisma.tempoEntry.findUnique({
    where: { id: entryId },
    select: { skill: { select: { level: { select: { program: { select: { userId: true } } } } } } },
  })
  if (!entry || entry.skill.level.program.userId !== userId) throw new Error("Not found")
}

export async function createSkill(levelId: string, title: string) {
  const userId = await getSessionUserId()
  await assertLevelOwnership(levelId, userId)

  const trimmedTitle = title.trim()
  if (!trimmedTitle) throw new Error("Title cannot be empty")
  if (trimmedTitle.length > 500) throw new Error("Title too long")

  const skill = await prisma.skill.create({
    data: {
      title: trimmedTitle,
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
  const userId = await getSessionUserId()
  await assertSkillOwnership(skillId, userId)

  if (notes.length > 50_000) throw new Error("Notes too long")

  await prisma.skill.update({
    where: { id: skillId },
    data: { notes },
  })
}

export async function createTempoEntry(skillId: string, quarterBpm: number) {
  const userId = await getSessionUserId()
  await assertSkillOwnership(skillId, userId)

  if (!Number.isInteger(quarterBpm) || quarterBpm < 1) {
    throw new Error("Quarter-note BPM must be a positive integer")
  }
  const entry = await prisma.tempoEntry.create({
    data: { skillId, quarterBpm },
  })
  revalidatePath("/")
  return entry
}

export async function deleteTempoEntry(entryId: string) {
  const userId = await getSessionUserId()
  await assertTempoEntryOwnership(entryId, userId)

  await prisma.tempoEntry.delete({ where: { id: entryId } })
  revalidatePath("/")
}

export async function toggleStage(stageId: string, completed: boolean) {
  const userId = await getSessionUserId()
  await assertStageOwnership(stageId, userId)

  const stage = await prisma.skillStage.update({
    where: { id: stageId },
    data: { completed },
    select: { skill: { select: { id: true, levelId: true } } },
  })

  const { id: skillId, levelId } = stage.skill

  await checkSkillCompletion(skillId)

  const levelCompleted = await checkLevelCompletion(levelId)
  if (levelCompleted) {
    const currentLevel = await prisma.level.findUniqueOrThrow({
      where: { id: levelId },
      select: { order: true, programId: true },
    })
    const nextLevelExists = await prisma.level.findFirst({
      where: { programId: currentLevel.programId, order: { gt: currentLevel.order } },
    })
    if (!nextLevelExists) {
      await createNextLevel(levelId)
      revalidatePath("/")
    }
  }
}

export async function addYoutubeLink(skillId: string, url: string) {
  const userId = await getSessionUserId()
  await assertSkillOwnership(skillId, userId)

  if (!url.trim()) throw new Error("URL cannot be empty")
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new Error("Invalid URL")
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error("Only https and http URLs are allowed")
  }
  const allowed = ["youtube.com", "www.youtube.com", "youtu.be"]
  if (!allowed.includes(parsed.hostname)) {
    throw new Error("Only YouTube links are allowed")
  }

  await prisma.youtubeLink.create({
    data: { skillId, url: url.trim() },
  })
  revalidatePath("/")
}

export async function deleteYoutubeLink(linkId: string) {
  const userId = await getSessionUserId()
  await assertYoutubeLinkOwnership(linkId, userId)

  await prisma.youtubeLink.delete({ where: { id: linkId } })
  revalidatePath("/")
}

export async function deleteSkill(skillId: string) {
  const userId = await getSessionUserId()
  await assertSkillOwnership(skillId, userId)

  await prisma.$transaction([
    prisma.skillStage.deleteMany({ where: { skillId } }),
    prisma.youtubeLink.deleteMany({ where: { skillId } }),
    prisma.skill.delete({ where: { id: skillId } }),
  ])
}
