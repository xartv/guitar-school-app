import { getProgram } from "@/actions/program.actions"
import { getLevels } from "@/actions/level.actions"
import CreateProgramForm from "@/features/program/CreateProgramForm"
import AddLevelButton from "@/features/levels/AddLevelButton"

export default async function Home() {
  const program = await getProgram()
  const levels = program ? await getLevels(program.id) : []

  return (
    <main>
      <h1>Guitar Practice Program</h1>
      {!program && <CreateProgramForm />}
      {program && (
        <div>
          <h2>{program.title}</h2>
          <AddLevelButton programId={program.id} />
          <div>
            {levels.map((level) => (
              <div key={level.id}>
                <h3>{level.title}</h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
