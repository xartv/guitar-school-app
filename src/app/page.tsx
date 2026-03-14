import { getProgram } from "@/actions/program.actions"
import CreateProgramForm from "@/features/program/CreateProgramForm"

export default async function Home() {
  const program = await getProgram()

  return (
    <main>
      <h1>Guitar Practice Program</h1>
      {!program && <CreateProgramForm />}
    </main>
  )
}
