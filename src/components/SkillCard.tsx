"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { SkillStageModel } from "@/generated/prisma/models/SkillStage"
import type { YoutubeLinkModel } from "@/generated/prisma/models/YoutubeLink"
import { deleteSkill, updateSkillNotes } from "@/actions/skill.actions"
import { Button } from "@/components/ui/button"
import { SkillProgress } from "@/components/SkillProgress/SkillProgress"
import { X, Pencil } from "lucide-react"

interface SkillCardProps {
  skill: { id: string; title: string; notes: string | null }
  stages: SkillStageModel[]
  links: YoutubeLinkModel[]
}

export function SkillCard({ skill, stages, links }: SkillCardProps) {
  const [isPending, setIsPending] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [notesValue, setNotesValue] = useState(skill.notes ?? "")
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

  function handleCancelEdit() {
    setNotesValue(skill.notes ?? "")
    setIsEditing(false)
  }

  return (
    <div className="bg-card border rounded-[12px] p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2 flex-1">
          <h3 className="text-sm font-medium text-card-foreground">{skill.title}</h3>
          <SkillProgress stages={stages} />
          {links.length > 0 && (
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline truncate"
                >
                  {link.url}
                </a>
              ))}
            </div>
          )}
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <textarea
                className="text-sm border rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px]"
                value={notesValue}
                onChange={(e) => setNotesValue(e.target.value)}
                placeholder="Add notes..."
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveNotes} disabled={isPending}>
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancelEdit} disabled={isPending}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              {skill.notes && (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{skill.notes}</p>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="self-start px-0 text-muted-foreground hover:text-foreground"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-3 w-3 mr-1" />
                Edit notes
              </Button>
            </>
          )}
        </div>
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
    </div>
  )
}
