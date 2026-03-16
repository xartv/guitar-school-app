"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { SkillStageModel } from "@/generated/prisma/models/SkillStage"
import type { YoutubeLinkModel } from "@/generated/prisma/models/YoutubeLink"
import { deleteSkill, updateSkillNotes, addYoutubeLink } from "@/actions/skill.actions"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardAction, CardContent } from "@/components/ui/card"
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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>{skill.title}</CardTitle>
        <CardAction>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isPending}
            aria-label="Delete skill"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
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
          <div className="flex gap-2">
            <input
              type="url"
              className="text-sm border rounded-md px-2 py-1 flex-1 focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Add video URL..."
              value={linkValue}
              onChange={(e) => setLinkValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddLink()}
            />
            <Button size="sm" variant="ghost" onClick={handleAddLink} disabled={isPending || !linkValue.trim()}>
              Add
            </Button>
          </div>
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
      </CardContent>
    </Card>
  )
}
