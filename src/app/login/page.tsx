import type { Metadata } from "next"
import LoginForm from "@/features/auth/LoginForm"

export const metadata: Metadata = { title: "Sign in — Guitar Practice" }

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <LoginForm />
    </div>
  )
}
