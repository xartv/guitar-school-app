"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSkill } from "@/actions/skill.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        + Add Skill
      </Button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Skill title"
        autoFocus
        disabled={isPending}
      />
      <Button type="submit" size="sm" disabled={isPending || !title.trim()}>
        {isPending ? "Adding..." : "Add"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => { setIsOpen(false); setTitle("") }}
      >
        Cancel
      </Button>
    </form>
  )
}
