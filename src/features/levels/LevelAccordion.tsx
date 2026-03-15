"use client"

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import AddSkillButton from "@/features/skills/AddSkillButton"
import { SkillCard } from "@/components/SkillCard"
import type { SkillModel } from "@/generated/prisma/models/Skill"

type Level = { id: string; title: string; skills: SkillModel[] }

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
