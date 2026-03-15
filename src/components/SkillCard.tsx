import type { SkillModel } from "@/generated/prisma/models/Skill"

interface SkillCardProps {
  skill: SkillModel
}

export function SkillCard({ skill }: SkillCardProps) {
  return (
    <div className="bg-card border rounded-[12px] p-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-sm font-medium text-card-foreground">{skill.title}</h3>
    </div>
  )
}
