export function checkRequiredEnvVars() {
  if (!process.env.AUTH_SECRET) {
    throw new Error("AUTH_SECRET environment variable is required but not set")
  }
}
