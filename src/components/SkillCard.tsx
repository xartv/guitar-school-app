"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { SkillModel } from "@/generated/prisma/models/Skill"
import { deleteSkill } from "@/actions/skill.actions"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface SkillCardProps {
  skill: SkillModel
}

export function SkillCard({ skill }: SkillCardProps) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (isPending) return
    setIsPending(true)
    try {
      await deleteSkill(skill.id)
      router.refresh()
    } catch (error) {
      console.error("Failed to delete skill:", error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="bg-card border rounded-[12px] p-4 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
      <h3 className="text-sm font-medium text-card-foreground">{skill.title}</h3>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        disabled={isPending}
        aria-label="Delete skill"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
