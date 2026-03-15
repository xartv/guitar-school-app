"use client"

import { Checkbox } from "@/components/ui/checkbox"
import type { SkillStageModel } from "@/generated/prisma/models/SkillStage"
import styles from "./SkillProgress.module.css"

interface SkillProgressProps {
  stages: SkillStageModel[]
}

export function SkillProgress({ stages }: SkillProgressProps) {
  return (
    <div className={styles.container}>
      <span className={styles.label}>Stages</span>
      <div className={styles.stages}>
        {stages.map((s) => (
          <div key={s.id} className={styles.stage}>
            {/* TODO: enable interaction in Task 34 */}
            <Checkbox id={s.id} checked={s.completed} />
            <label htmlFor={s.id} className={styles.stageLabel}>
              {s.stage}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
