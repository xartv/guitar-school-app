"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createRepertoireItem } from "@/actions/repertoire.actions"
import { RepertoireCard } from "@/components/RepertoireCard"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface RepertoireSectionProps {
  items: {
    id: string
    title: string
    notes: string | null
    completed: boolean
    links: { id: string; url: string }[]
  }[]
  programId: string
}

export default function RepertoireSection({ items, programId }: RepertoireSectionProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [title, setTitle] = useState("")
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  async function handleCreate() {
    const trimmed = title.trim()
    if (!trimmed) return
    setIsPending(true)
    try {
      await createRepertoireItem(programId, trimmed)
      setTitle("")
      setIsAdding(false)
      router.refresh()
    } catch (error) {
      console.error("Failed to create repertoire item:", error)
    } finally {
      setIsPending(false)
    }
  }

  function handleCancel() {
    setTitle("")
    setIsAdding(false)
  }

  return (
    <div className="space-y-3">
      {/* Item list */}
      {items.length === 0 && !isAdding ? (
        <div className="rounded-xl border border-dashed border-border bg-card/30 px-6 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            No songs yet — click <strong className="text-foreground">Add Song</strong> to start tracking your repertoire.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <RepertoireCard key={item.id} item={item} links={item.links} />
          ))}
        </div>
      )}

      {/* Add song inline form */}
      {isAdding ? (
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 text-sm bg-input/50 border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            placeholder="Song title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate()
              if (e.key === "Escape") handleCancel()
            }}
            autoFocus
            disabled={isPending}
          />
          <Button
            size="sm"
            className="h-9 px-4 text-sm"
            onClick={handleCreate}
            disabled={isPending || !title.trim()}
          >
            {isPending ? "Adding..." : "Add"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-9 px-4 text-sm"
            onClick={handleCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="h-4 w-4" />
          Add Song
        </Button>
      )}
    </div>
  )
}
