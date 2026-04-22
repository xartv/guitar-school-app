import type { Metadata } from "next"
import RegisterForm from "@/features/auth/RegisterForm"

export const metadata: Metadata = { title: "Create account — Guitar Practice" }

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <RegisterForm />
    </div>
  )
}
