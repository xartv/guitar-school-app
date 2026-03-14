import { getProgram } from "@/actions/program.actions"

export default async function Home() {
  const program = await getProgram()

  return (
    <main>
      <h1>Guitar Practice Program</h1>
      {!program && (
        <button>Create Program</button>
      )}
    </main>
  )
}
