"use client"

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import AddSkillButton from "@/features/skills/AddSkillButton"

type Level = { id: string; title: string }

interface LevelAccordionProps {
  levels: Level[]
}

export default function LevelAccordion({ levels }: LevelAccordionProps) {
  return (
    <div className="rounded-lg border bg-card shadow-sm px-4">
      <Accordion multiple>
        {levels.map((level) => (
          <AccordionItem key={level.id} value={level.id}>
            <AccordionTrigger className="text-base font-semibold">
              {level.title}
            </AccordionTrigger>
            <AccordionContent>
              <AddSkillButton levelId={level.id} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
