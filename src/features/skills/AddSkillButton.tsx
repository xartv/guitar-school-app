"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSkill } from "@/actions/skill.actions"
import { Plus, Loader2 } from "lucide-react"

interface AddSkillButtonProps {
  levelId: string
}

export default function AddSkillButton({ levelId }: AddSkillButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || isPending) return
    setIsPending(true)
    try {
      await createSkill(levelId, title.trim())
      setTitle("")
      setIsOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Failed to create skill:", error)
    } finally {
      setIsPending(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 w-full px-3 py-2 text-xs font-medium rounded-lg border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors"
      >
        <Plus className="h-3.5 w-3.5" />
        Add Skill
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Skill title..."
        autoFocus
        disabled={isPending}
        className="flex-1 text-xs bg-input/50 border border-border rounded-lg px-3 py-1.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
      />
      <button
        type="submit"
        disabled={isPending || !title.trim()}
        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
        {isPending ? "Adding..." : "Add"}
      </button>
      <button
        type="button"
        onClick={() => { setIsOpen(false); setTitle("") }}
        className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50 transition-colors"
      >
        Cancel
      </button>
    </form>
  )
}
