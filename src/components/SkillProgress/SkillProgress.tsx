"use client"

import { Checkbox } from "@/components/ui/checkbox"
import styles from "./SkillProgress.module.css"

const STAGES = [1, 2, 3, 4]

export function SkillProgress() {
  return (
    <div className={styles.container}>
      <span className={styles.label}>Stages</span>
      <div className={styles.stages}>
        {STAGES.map((stage) => (
          <div key={stage} className={styles.stage}>
            {/* TODO: connect to real data in Task 32, enable interaction in Task 34 */}
            <Checkbox id={`stage-${stage}`} defaultChecked={false} />
            <label htmlFor={`stage-${stage}`} className={styles.stageLabel}>
              {stage}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
