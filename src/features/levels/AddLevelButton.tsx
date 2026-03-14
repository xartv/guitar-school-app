"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createLevel } from "@/actions/level.actions"

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
    <button onClick={handleClick} disabled={isPending}>
      {isPending ? "Adding..." : "Add Level"}
    </button>
  )
}
