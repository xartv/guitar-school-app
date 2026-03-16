"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createLevel } from "@/actions/level.actions"
import { Plus, Loader2 } from "lucide-react"

interface AddLevelButtonProps {
  programId: string
}

export default function AddLevelButton({ programId }: AddLevelButtonProps) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  async function handleClick() {
    if (isPending) return
    setIsPending(true)
    try {
      await createLevel(programId)
      router.refresh()
    } catch (error) {
      console.error("Failed to create level:", error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50 transition-colors shrink-0"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
      {isPending ? "Adding..." : "Add Level"}
    </button>
  )
}
