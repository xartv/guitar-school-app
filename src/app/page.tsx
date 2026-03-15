import { getProgram } from "@/actions/program.actions"
import { getLevels } from "@/actions/level.actions"
import CreateProgramForm from "@/features/program/CreateProgramForm"
import AddLevelButton from "@/features/levels/AddLevelButton"
import LevelAccordion from "@/features/levels/LevelAccordion"

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
          <LevelAccordion levels={levels} />
        </div>
      )}
    </main>
  )
}
