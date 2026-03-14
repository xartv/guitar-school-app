import { getProgram } from "@/actions/program.actions"
import CreateProgramForm from "@/features/program/CreateProgramForm"
import AddLevelButton from "@/features/levels/AddLevelButton"

export default async function Home() {
  const program = await getProgram()

  return (
    <main>
      <h1>Guitar Practice Program</h1>
      {!program && <CreateProgramForm />}
      {program && (
        <div>
          <h2>{program.title}</h2>
          <AddLevelButton programId={program.id} />
        </div>
      )}
    </main>
  )
}
