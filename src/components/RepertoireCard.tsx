"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import ReactMarkdown from "react-markdown"
import {
  deleteRepertoireItem,
  toggleRepertoireItemCompleted,
  updateRepertoireItemNotes,
  addRepertoireLink,
} from "@/actions/repertoire.actions"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Pencil, Loader2, ChevronDown, CheckCircle2, Circle } from "lucide-react"
import styles from "./RepertoireCard.module.css"

interface RepertoireCardProps {
  item: { id: string; title: string; notes: string | null; completed: boolean }
  links: { id: string; url: string }[]
}

export function RepertoireCard({ item, links }: RepertoireCardProps) {
  const [isPending, setIsPending] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [notesValue, setNotesValue] = useState(item.notes ?? "")
  const [linkValue, setLinkValue] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [completed, setCompleted] = useState(item.completed)

  const router = useRouter()

  async function handleToggleCompleted() {
    const next = !completed
    setCompleted(next)
    try {
      await toggleRepertoireItemCompleted(item.id, next)
      router.refresh()
    } catch (error) {
      setCompleted(!next)
      console.error("Failed to toggle completion:", error)
    }
  }

  async function handleDelete() {
    if (isPending) return
    setIsPending(true)
    try {
      await deleteRepertoireItem(item.id)
      router.refresh()
    } catch (error) {
      console.error("Failed to delete item:", error)
    } finally {
      setIsPending(false)
    }
  }

  async function handleSaveNotes() {
    setIsPending(true)
    try {
      await updateRepertoireItemNotes(item.id, notesValue)
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
      await addRepertoireLink(item.id, url)
      setLinkValue("")
      router.refresh()
    } catch (error) {
      console.error("Failed to add link:", error)
    } finally {
      setIsPending(false)
    }
  }

  function handleCancelEdit() {
    setNotesValue(item.notes ?? "")
    setIsEditing(false)
  }

  return (
    <Card
      className={cn(
        "group/card card-hover border border-border bg-card shadow-sm rounded-xl overflow-hidden gap-0",
        completed && "bg-emerald-500/5"
      )}
    >
      {/* Header row — always visible */}
      <div className={styles.headerRow}>
        {/* Toggle trigger (title + done badge) */}
        <button className={styles.trigger} onClick={() => setIsOpen((o) => !o)} aria-expanded={isOpen}>
          <span className={cn(styles.title, completed && styles.titleCompleted)}>{item.title}</span>
          {completed && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 shrink-0">
              ✓ Done
            </span>
          )}
        </button>

        {/* Delete button — sibling of trigger */}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0 opacity-0 group-hover/card:opacity-100 transition-opacity"
          onClick={handleDelete}
          disabled={isPending}
          aria-label="Delete item"
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
          <CardContent className="px-4 pb-4 pt-3 flex flex-col gap-3">
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
                {item.notes && (
                  <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2 prose prose-xs max-w-none">
                    <ReactMarkdown>{item.notes}</ReactMarkdown>
                  </div>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="self-start h-6 px-0 text-xs text-muted-foreground hover:text-foreground gap-1"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-3 w-3" />
                  {item.notes ? "Edit notes" : "Add notes"}
                </Button>
              </div>
            )}

            <div className="h-px bg-border" />

            {/* Actions row: complete + delete */}
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="ghost"
                className={cn(
                  "h-6 px-0 text-xs gap-1",
                  completed
                    ? "text-emerald-500 hover:text-emerald-600"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={handleToggleCompleted}
                disabled={isPending}
              >
                {completed
                  ? <><CheckCircle2 className="h-3.5 w-3.5" /> Mark as active</>
                  : <><Circle className="h-3.5 w-3.5" /> Mark as done</>
                }
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-0 text-xs text-destructive hover:text-destructive/80 gap-1"
                onClick={handleDelete}
                disabled={isPending}
              >
                <X className="h-3 w-3" />
                Delete
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  )
}
