"use client"

import { useTransition } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logoutUser } from "@/actions/auth.actions"

interface HeaderUserMenuProps {
  email: string
}

export function HeaderUserMenu({ email }: HeaderUserMenuProps) {
  const [isPending, startTransition] = useTransition()

  function handleSignOut() {
    startTransition(async () => {
      try {
        await logoutUser()
      } catch (err) {
        if (err instanceof Error && (err as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) throw err
      }
    })
  }

  return (
    <div className="ml-auto flex items-center gap-2 min-w-0">
      <span className="hidden sm:block text-xs text-muted-foreground truncate max-w-[180px]">
        {email}
      </span>
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-foreground shrink-0"
        disabled={isPending}
        onClick={handleSignOut}
      >
        {isPending ? <Loader2 size={14} className="animate-spin" /> : "Sign out"}
      </Button>
    </div>
  )
}
