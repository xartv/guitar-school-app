"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import {
  Accordion,
  AccordionItem,
  AccordionContent,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { X, ChevronDown, Loader2 } from "lucide-react"
import AddSkillButton from "@/features/skills/AddSkillButton"
import { SkillCard } from "@/components/SkillCard"
import { deleteLevel } from "@/actions/level.actions"
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
      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <X className="h-3.5 w-3.5" />
      )}
    </Button>
  )
}

export default function LevelAccordion({ levels }: LevelAccordionProps) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <Accordion multiple>
        {levels.map((level, index) => {
          const completedCount = level.skills.filter((s) => s.completed).length
          const totalCount = level.skills.length
          const allDone = totalCount > 0 && completedCount === totalCount

          return (
            <AccordionItem
              key={level.id}
              value={level.id}
              className="border-b border-border last:border-b-0 group relative"
            >
              {/* Left amber accent stripe */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] gradient-amber rounded-l-full" />

              <AccordionPrimitive.Header className="flex items-center pl-5 pr-2">
                <AccordionPrimitive.Trigger className="group/trigger relative flex flex-1 items-center gap-3 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
                  {/* Level number badge */}
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center border border-primary/20">
                    {index + 1}
                  </span>

                  {/* Level title */}
                  <span className="text-base font-semibold text-foreground">
                    {level.title}
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
        })}
      </Accordion>
    </div>
  )
}
