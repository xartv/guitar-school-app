"use server"

import { CredentialsSignin } from "next-auth"
import { signIn, signOut } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function registerUser(email: string, password: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase()

  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error("Invalid email address")
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters")
  }
  if (password.length > 72) {
    throw new Error("Password must be at most 72 characters")
  }

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })
  if (existing) {
    throw new Error("An account with this email already exists")
  }

  const passwordHash = await bcrypt.hash(password, 12)
  await prisma.user.create({ data: { email: normalizedEmail, passwordHash } })

  await signIn("credentials", { email: normalizedEmail, password, redirectTo: "/" })
}

export async function loginUser(email: string, password: string): Promise<void> {
  try {
    await signIn("credentials", { email: email.trim().toLowerCase(), password, redirectTo: "/" })
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      throw new Error("Invalid email or password")
    }
    throw error
  }
}

export async function logoutUser(): Promise<void> {
  await signOut({ redirectTo: "/login" })
}
