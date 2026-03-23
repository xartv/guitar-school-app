"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createTempoEntry, deleteTempoEntry } from "@/actions/skill.actions"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import styles from "./TempoTable.module.css"

const COLS = ["1/4", "1/8", "1/16", "1/12", "1/24"] as const
type Col = typeof COLS[number]

const DIVISIONS: Record<Col, number> = {
  "1/4": 1,
  "1/8": 2,
  "1/16": 4,
  "1/12": 3,
  "1/24": 6,
}

function computeAll(bpm: number, fromCol: Col): Record<Col, number> {
  const quarterBpm = bpm / DIVISIONS[fromCol]
  return Object.fromEntries(
    COLS.map((col) => [col, Math.round(quarterBpm * DIVISIONS[col])])
  ) as Record<Col, number>
}

interface TempoTableProps {
  skillId: string
  entries: { id: string; quarterBpm: number }[]
}

export function TempoTable({ skillId, entries }: TempoTableProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isPending, setIsPending] = useState(false)

  // Add row state: which col has the user's input
  const [activeCol, setActiveCol] = useState<Col>("1/4")
  const [inputValues, setInputValues] = useState<Record<Col, string>>({
    "1/4": "", "1/8": "", "1/16": "", "1/12": "", "1/24": "",
  })

  function handleInputChange(col: Col, raw: string) {
    setActiveCol(col)
    const num = parseInt(raw, 10)
    if (!raw || isNaN(num) || num < 1) {
      // clear all
      setInputValues({ "1/4": "", "1/8": "", "1/16": "", "1/12": "", "1/24": "" })
      return
    }
    const computed = computeAll(num, col)
    const next = {} as Record<Col, string>
    for (const c of COLS) {
      next[c] = c === col ? raw : String(computed[c])
    }
    setInputValues(next)
  }

  function clearInputs() {
    setInputValues({ "1/4": "", "1/8": "", "1/16": "", "1/12": "", "1/24": "" })
    setActiveCol("1/4")
  }

  async function handleAdd() {
    const rawVal = inputValues[activeCol]
    const num = parseInt(rawVal, 10)
    if (!rawVal || isNaN(num) || num < 1) return
    const quarterBpm = Math.round(num / DIVISIONS[activeCol])
    if (quarterBpm < 1 || quarterBpm > 300) return
    setIsPending(true)
    try {
      await createTempoEntry(skillId, quarterBpm)
      clearInputs()
      setIsAdding(false)
      router.refresh()
    } catch (err) {
      console.error("Failed to create tempo entry:", err)
    } finally {
      setIsPending(false)
    }
  }

  async function handleDelete(entryId: string) {
    setDeletingId(entryId)
    try {
      await deleteTempoEntry(entryId)
      router.refresh()
    } catch (err) {
      console.error("Failed to delete tempo entry:", err)
    } finally {
      setDeletingId(null)
    }
  }

  const hasInput = COLS.some((c) => inputValues[c] !== "")

  return (
    <div>
      {(entries.length > 0 || isAdding) && (
        <div className={styles.grid}>
          {/* Header */}
          {COLS.map((col) => (
            <span key={col} className={styles.headerCell}>{col}</span>
          ))}
          <span className={styles.headerSpacer} />

          {/* Saved rows */}
          {entries.map((entry) => {
            const vals = computeAll(entry.quarterBpm, "1/4")
            const isDeleting = deletingId === entry.id
            return (
              <div key={entry.id} className={styles.row}>
                {COLS.map((col) => (
                  <span key={col} className={styles.cell}>{vals[col]}</span>
                ))}
                <span className={styles.deleteCell}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-5 w-5 text-muted-foreground hover:text-destructive", styles.deleteBtn)}
                    onClick={() => handleDelete(entry.id)}
                    disabled={isDeleting}
                    aria-label="Delete tempo entry"
                  >
                    {isDeleting
                      ? <Loader2 className="h-3 w-3 animate-spin" />
                      : <Trash2 className="h-3 w-3" />
                    }
                  </Button>
                </span>
              </div>
            )
          })}

          {/* Add row */}
          {isAdding && (
            <div className={styles.row}>
              {COLS.map((col) => (
                <input
                  key={col}
                  type="number"
                  min={1}
                  className={cn(styles.addInput, col === activeCol && styles.activeInput)}
                  value={inputValues[col]}
                  placeholder="—"
                  onChange={(e) => handleInputChange(col, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAdd()
                    if (e.key === "Escape") { clearInputs(); setIsAdding(false) }
                  }}
                  disabled={isPending}
                  autoFocus={col === "1/4"}
                />
              ))}
              <span className={styles.deleteCell}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-primary hover:text-primary/80"
                  onClick={handleAdd}
                  disabled={isPending || !hasInput}
                  aria-label="Confirm add"
                >
                  {isPending
                    ? <Loader2 className="h-3 w-3 animate-spin" />
                    : <Plus className="h-3 w-3" />
                  }
                </Button>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Actions below grid */}
      {!isAdding && (
        <Button
          size="sm"
          variant="ghost"
          className="h-6 px-0 text-xs text-muted-foreground hover:text-foreground gap-1 mt-1"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="h-3 w-3" />
          Add tempo
        </Button>
      )}
    </div>
  )
}
