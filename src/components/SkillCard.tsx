"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { SkillStageModel } from "@/generated/prisma/models/SkillStage"
import type { YoutubeLinkModel } from "@/generated/prisma/models/YoutubeLink"
import ReactMarkdown from "react-markdown"
import { deleteSkill, updateSkillNotes, addYoutubeLink } from "@/actions/skill.actions"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { SkillProgress } from "@/components/SkillProgress/SkillProgress"
import { X, Pencil, Loader2 } from "lucide-react"

interface SkillCardProps {
  skill: { id: string; title: string; notes: string | null }
  stages: SkillStageModel[]
  links: YoutubeLinkModel[]
  completed?: boolean
}

export function SkillCard({ skill, stages, links, completed = false }: SkillCardProps) {
  const [isPending, setIsPending] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [notesValue, setNotesValue] = useState(skill.notes ?? "")
  const [linkValue, setLinkValue] = useState("")
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
        "group card-hover border border-border bg-card shadow-sm rounded-xl overflow-hidden",
        completed && "ring-completed border-transparent"
      )}
    >
      <CardHeader className="px-4 pt-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-semibold leading-tight text-foreground">
            {skill.title}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0 -mt-0.5 -mr-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 flex flex-col gap-3">
        {/* Stages */}
        <SkillProgress stages={stages} />

        <div className="h-px bg-border" />

        {/* Video links */}
        <div className="flex flex-col gap-1.5">
          {links.length > 0 && (
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors group/link"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0 text-red-500">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span className="truncate group-hover/link:underline underline-offset-2">
                    {link.url}
                  </span>
                </a>
              ))}
            </div>
          )}

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
      </CardContent>
    </Card>
  )
}
