"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { SkillStageModel } from "@/generated/prisma/models/SkillStage"
import type { YoutubeLinkModel } from "@/generated/prisma/models/YoutubeLink"
import ReactMarkdown from "react-markdown"
import { deleteSkill, updateSkillNotes, addYoutubeLink, deleteYoutubeLink } from "@/actions/skill.actions"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SkillProgress } from "@/components/SkillProgress/SkillProgress"
import { X, Pencil, Loader2, ChevronDown } from "lucide-react"
import { YoutubeEmbedList } from "@/components/YoutubeEmbed/YoutubeEmbed"
import { TempoTable } from "@/components/TempoTable/TempoTable"
import styles from "./SkillCard.module.css"

interface SkillCardProps {
  skill: { id: string; title: string; notes: string | null }
  stages: SkillStageModel[]
  links: YoutubeLinkModel[]
  tempoEntries: { id: string; quarterBpm: number }[]
  completed?: boolean
}

function SkillProgressPips({ stages, completed }: { stages: SkillStageModel[]; completed: boolean }) {
  if (completed) {
    return (
      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/20">
        ✓ Done
      </span>
    )
  }
  const completedCount = stages.filter((s) => s.completed).length
  return (
    <div className={styles.pips}>
      {stages.map((s) => (
        <div key={s.id} className={cn(styles.pip, s.completed && styles.pipFilled)} />
      ))}
      <span className={styles.pipsCount}>{completedCount}/{stages.length}</span>
    </div>
  )
}

export function SkillCard({ skill, stages, links, tempoEntries, completed = false }: SkillCardProps) {
  const [isPending, setIsPending] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [notesValue, setNotesValue] = useState(skill.notes ?? "")
  const [linkValue, setLinkValue] = useState("")
  const [isOpen, setIsOpen] = useState(false)

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

  async function handleSaveNotes() {
    setIsPending(true)
    try {
      await updateSkillNotes(skill.id, notesValue)
      setIsEditing(false)
      router.refresh()
    } catch (error) {
      console.error("Failed to update notes:", error)
    } finally {
      setIsPending(false)
    }
  }

  async function handleAddLink() {
    const url = linkValue.trim()
    if (!url) return
    setIsPending(true)
    try {
      await addYoutubeLink(skill.id, url)
      setLinkValue("")
      router.refresh()
    } catch (error) {
      console.error("Failed to add link:", error)
    } finally {
      setIsPending(false)
    }
  }

  function handleCancelEdit() {
    setNotesValue(skill.notes ?? "")
    setIsEditing(false)
  }

  return (
    <Card
      className={cn(
        "group/card card-hover border border-border bg-card shadow-sm rounded-xl overflow-hidden gap-0",
        completed && "ring-completed border-transparent"
      )}
    >
      {/* Header row — always visible */}
      <div className={styles.headerRow}>
        {/* Toggle trigger (title + pips) */}
        <button className={styles.trigger} onClick={() => setIsOpen((o) => !o)} aria-expanded={isOpen}>
          <span className={styles.title}>{skill.title}</span>

          {/* Tempo count badge when entries exist */}
          {tempoEntries.length > 0 && (
            <span className={styles.tempoBadge}>♩ {tempoEntries.length}</span>
          )}

          <SkillProgressPips stages={stages} completed={completed} />
        </button>

        {/* Delete button — sibling of trigger */}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0 opacity-0 group-hover/card:opacity-100 transition-opacity"
          onClick={handleDelete}
          disabled={isPending}
          aria-label="Delete skill"
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <X className="h-3.5 w-3.5" />
          )}
        </Button>

        {/* Chevron — far right, outside trigger */}
        <button
          className="p-2 shrink-0 text-muted-foreground focus:outline-none"
          onClick={() => setIsOpen((o) => !o)}
          tabIndex={-1}
          aria-hidden
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* Collapsible body */}
      <div className={cn(styles.body, isOpen && styles.bodyOpen)} inert={!isOpen || undefined}>
        <div className={styles.bodyInner}>
          <CardContent className="px-4 pb-4 pt-0 flex flex-col gap-3">
            {/* Stages */}
            <SkillProgress stages={stages} />

            <div className="h-px bg-border" />

            {/* Video links */}
            <div className="flex flex-col gap-1.5">
              <YoutubeEmbedList
                links={links}
                onDelete={async (id) => { await deleteYoutubeLink(id); router.refresh() }}
              />

              {/* Add link */}
              <div className="flex gap-1.5">
                <input
                  type="url"
                  className="flex-1 text-xs bg-input/50 border border-border rounded-lg px-3 py-1.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  placeholder="Paste YouTube URL..."
                  value={linkValue}
                  onChange={(e) => setLinkValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddLink()}
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-3 text-xs"
                  onClick={handleAddLink}
                  disabled={isPending || !linkValue.trim()}
                >
                  {isPending ? "Adding..." : "Add"}
                </Button>
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* Notes */}
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <textarea
                  className="text-xs bg-muted/50 border border-border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px] text-foreground placeholder:text-muted-foreground font-mono"
                  value={notesValue}
                  onChange={(e) => setNotesValue(e.target.value)}
                  placeholder="Add markdown notes..."
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="h-7 px-3 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handleSaveNotes}
                    disabled={isPending}
                  >
                    {isPending ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-3 text-xs"
                    onClick={handleCancelEdit}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {skill.notes && (
                  <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2 prose prose-xs max-w-none">
                    <ReactMarkdown>{skill.notes}</ReactMarkdown>
                  </div>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="self-start h-6 px-0 text-xs text-muted-foreground hover:text-foreground gap-1"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-3 w-3" />
                  {skill.notes ? "Edit notes" : "Add notes"}
                </Button>
              </div>
            )}

            <div className="h-px bg-border" />

            {/* Tempo table */}
            <TempoTable skillId={skill.id} entries={tempoEntries} />
          </CardContent>
        </div>
      </div>
    </Card>
  )
}
