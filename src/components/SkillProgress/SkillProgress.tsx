"use client"

import { useOptimistic, useTransition } from "react"
import { useRouter } from "next/navigation"
import type { SkillStageModel } from "@/generated/prisma/models/SkillStage"
import { toggleStage } from "@/actions/skill.actions"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
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

  const completedCount = optimisticStages.filter((s) => s.completed).length

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.label}>Progress</span>
        <span className={styles.progress}>
          {completedCount}/{optimisticStages.length}
        </span>
      </div>

      <div className={styles.stages} role="group" aria-label="Practice stages">
        {optimisticStages.map((s) => (
          <div
            key={s.id}
            className={styles.stage}
            role="checkbox"
            aria-checked={s.completed}
            aria-label={`Stage ${s.stage}`}
            tabIndex={0}
            onClick={() => handleToggle(s.id, !s.completed)}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault()
                handleToggle(s.id, !s.completed)
              }
            }}
          >
            <div className={cn(styles.pill, s.completed && styles.pillCompleted)}>
              {s.completed ? (
                <Check className={styles.checkIcon} />
              ) : (
                <span className={styles.dot} />
              )}
            </div>
            <span className={cn(styles.stageLabel, s.completed && styles.stageLabelCompleted)}>
              {s.stage}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
