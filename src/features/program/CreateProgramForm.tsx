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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Program title"
        required
        disabled={isPending}
      />
      <button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Program"}
      </button>
    </form>
  )
}
