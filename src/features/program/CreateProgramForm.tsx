"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createProgram } from "@/actions/program.actions"

export default function CreateProgramForm() {
  const [title, setTitle] = useState("")
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || isPending) return

    setIsPending(true)
    try {
      await createProgram(title.trim())
      setTitle("")
      router.refresh()
    } catch (error) {
      console.error("Failed to create program:", error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. 2025 Practice Program"
        required
        disabled={isPending}
        className="flex-1 text-sm bg-input/50 border border-border rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
      />
      <button
        type="submit"
        disabled={isPending || !title.trim()}
        className="shrink-0 px-5 py-2.5 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {isPending ? "Creating..." : "Create Program"}
      </button>
    </form>
  )
}
