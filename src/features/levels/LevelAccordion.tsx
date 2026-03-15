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
import { X, ChevronDown, ChevronUp } from "lucide-react"
import AddSkillButton from "@/features/skills/AddSkillButton"
import { SkillCard } from "@/components/SkillCard"
import { deleteLevel } from "@/actions/level.actions"
import type { SkillModel } from "@/generated/prisma/models/Skill"

type Level = { id: string; title: string; skills: SkillModel[] }

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
    >
      <X className="h-4 w-4" />
    </Button>
  )
}

export default function LevelAccordion({ levels }: LevelAccordionProps) {
  return (
    <div className="rounded-lg border bg-card shadow-sm px-4">
      <Accordion multiple>
        {levels.map((level) => (
          <AccordionItem key={level.id} value={level.id}>
            <AccordionPrimitive.Header className="flex items-center">
              <AccordionPrimitive.Trigger className="group/accordion-trigger relative flex flex-1 items-center justify-between rounded-lg border border-transparent py-2.5 text-left text-base font-semibold transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-disabled:pointer-events-none aria-disabled:opacity-50">
                {level.title}
                <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden" />
                <ChevronUp className="ml-auto h-4 w-4 text-muted-foreground pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline" />
              </AccordionPrimitive.Trigger>
              <DeleteLevelButton levelId={level.id} />
            </AccordionPrimitive.Header>
            <AccordionContent>
              <div className="flex flex-col gap-2 pb-2">
                {level.skills.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
                <AddSkillButton levelId={level.id} />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
