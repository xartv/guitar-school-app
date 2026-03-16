"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import {
  Accordion,
  AccordionItem,
  AccordionContent,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, ChevronDown, Loader2, Pencil } from "lucide-react"
import AddSkillButton from "@/features/skills/AddSkillButton"
import { SkillCard } from "@/components/SkillCard"
import { deleteLevel, updateLevelTitle } from "@/actions/level.actions"
import type { SkillStageModel } from "@/generated/prisma/models/SkillStage"
import type { YoutubeLinkModel } from "@/generated/prisma/models/YoutubeLink"
import { cn } from "@/lib/utils"

type SkillWithDetails = {
  id: string
  title: string
  notes: string | null
  completed: boolean
  stages: SkillStageModel[]
  links: YoutubeLinkModel[]
}

type Level = { id: string; title: string; skills: SkillWithDetails[] }

interface LevelAccordionProps {
  levels: Level[]
}

function DeleteLevelButton({ levelId }: { levelId: string }) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (isPending) return
    setIsPending(true)
    try {
      await deleteLevel(levelId)
      router.refresh()
    } catch (error) {
      console.error("Failed to delete level:", error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
      aria-label="Delete level"
      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive opacity-0 group-hover/item:opacity-100 transition-opacity"
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <X className="h-3.5 w-3.5" />
      )}
    </Button>
  )
}

function LevelAccordionItem({ level, index }: { level: Level; index: number }) {
  const [isEditing, setIsEditing] = useState(false)
  const [titleValue, setTitleValue] = useState(level.title)
  const [isPendingSave, setIsPendingSave] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const completedCount = level.skills.filter((s) => s.completed).length
  const totalCount = level.skills.length
  const allDone = totalCount > 0 && completedCount === totalCount

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.select()
    }
  }, [isEditing])

  function startEditing(e: React.MouseEvent) {
    e.stopPropagation()
    setTitleValue(level.title)
    setIsEditing(true)
  }

  async function save() {
    if (isPendingSave) return
    const trimmed = titleValue.trim()
    if (!trimmed) {
      setTitleValue(level.title)
      setIsEditing(false)
      return
    }
    if (trimmed !== level.title) {
      setIsPendingSave(true)
      try {
        await updateLevelTitle(level.id, trimmed)
        router.refresh()
      } catch (error) {
        console.error("Failed to update level title:", error)
        setTitleValue(level.title)
      } finally {
        setIsPendingSave(false)
      }
    }
    setIsEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault()
      save()
    } else if (e.key === "Escape") {
      setTitleValue(level.title)
      setIsEditing(false)
    }
  }

  return (
    <AccordionItem
      value={level.id}
      className="border-b border-border last:border-b-0 group/item relative"
    >
      {/* Left amber accent stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] gradient-amber rounded-l-full" />

      <AccordionPrimitive.Header className="flex items-center pl-5 pr-2">
        {isEditing ? (
          <div className="flex flex-1 items-center gap-3 py-4">
            {/* Level number badge */}
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center border border-primary/20">
              {index + 1}
            </span>
            <Input
              ref={inputRef}
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={save}
              onKeyDown={handleKeyDown}
              className="h-7 w-48 text-sm font-semibold px-2"
              autoFocus
            />
          </div>
        ) : (
          <AccordionPrimitive.Trigger className="group/trigger relative flex flex-1 items-center gap-3 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
            {/* Level number badge */}
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center border border-primary/20">
              {index + 1}
            </span>

            {/* Level title */}
            <span className="text-base font-semibold text-foreground">
              {titleValue}
            </span>

            {/* Skill count / completed badge */}
            {allDone ? (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/20">
                ✓ Complete
              </span>
            ) : (
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {completedCount}/{totalCount}
              </span>
            )}

            {/* Chevron */}
            <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 group-aria-expanded/trigger:rotate-180" />
          </AccordionPrimitive.Trigger>
        )}

        {/* Pencil edit button — sibling to Trigger, not nested inside it */}
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={startEditing}
            aria-label="Edit level title"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground opacity-0 group-hover/item:opacity-100 transition-opacity"
          >
            <Pencil className="h-3 w-3" />
          </Button>
        )}

        <DeleteLevelButton levelId={level.id} />
      </AccordionPrimitive.Header>

      <AccordionContent>
        <div className={cn(
          "mx-3 mb-3 rounded-xl p-3 flex flex-col gap-2",
          "bg-muted/30"
        )}>
          {level.skills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              stages={skill.stages}
              links={skill.links}
              completed={skill.completed}
            />
          ))}
          <AddSkillButton levelId={level.id} />
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

export default function LevelAccordion({ levels }: LevelAccordionProps) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <Accordion multiple>
        {levels.map((level, index) => (
          <LevelAccordionItem key={level.id} level={level} index={index} />
        ))}
      </Accordion>
    </div>
  )
}
