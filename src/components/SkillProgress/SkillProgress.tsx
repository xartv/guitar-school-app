"use client"

import { useOptimistic, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import type { SkillStageModel } from "@/generated/prisma/models/SkillStage"
import { toggleStage } from "@/actions/skill.actions"
import styles from "./SkillProgress.module.css"

interface SkillProgressProps {
  stages: SkillStageModel[]
}

export function SkillProgress({ stages }: SkillProgressProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [optimisticStages, updateOptimistic] = useOptimistic(
    stages,
    (current, { id, completed }: { id: string; completed: boolean }) =>
      current.map((s) => (s.id === id ? { ...s, completed } : s))
  )

  function handleToggle(stageId: string, completed: boolean) {
    startTransition(async () => {
      updateOptimistic({ id: stageId, completed })
      await toggleStage(stageId, completed)
      router.refresh()
    })
  }

  return (
    <div className={styles.container}>
      <span className={styles.label}>Stages</span>
      <div className={styles.stages}>
        {optimisticStages.map((s) => (
          <div key={s.id} className={styles.stage}>
            <Checkbox
              id={s.id}
              checked={s.completed}
              onCheckedChange={(checked) => handleToggle(s.id, checked === true)}
            />
            <label htmlFor={s.id} className={styles.stageLabel}>
              {s.stage}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
