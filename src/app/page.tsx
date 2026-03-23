import { getProgram } from "@/actions/program.actions"
import { getLevels } from "@/actions/level.actions"
import { getRepertoireItems } from "@/actions/repertoire.actions"
import CreateProgramForm from "@/features/program/CreateProgramForm"
import AddLevelButton from "@/features/levels/AddLevelButton"
import LevelAccordion from "@/features/levels/LevelAccordion"
import RepertoireSection from "@/features/repertoire/RepertoireSection"

export default async function Home() {
  const program = await getProgram()
  const [levels, repertoireItems] = program
    ? await Promise.all([getLevels(program.id), getRepertoireItems(program.id)])
    : [[], []]

  return (
    <main className="min-h-screen bg-background">
      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/60 backdrop-blur-sm">
        <div className="h-[3px] gradient-amber w-full" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <span className="text-2xl" aria-hidden>🎸</span>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Guitar Practice Program
          </h1>
        </div>
      </header>

      {/* ── Content ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {!program && (
          <div className="animate-fade-in-up">
            <div className="rounded-2xl border border-dashed border-border bg-card/40 px-8 py-16 text-center space-y-4">
              <div className="text-5xl" aria-hidden>🎸</div>
              <h2 className="text-2xl font-bold text-foreground">
                Start your practice journey
              </h2>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                Create a program to begin tracking your guitar skills level by level.
              </p>
              <div className="pt-2">
                <CreateProgramForm />
              </div>
            </div>
          </div>
        )}

        {program && (
          <div className="space-y-8 animate-fade-in-up">
            {/* ── Repertoire section ── */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Repertoire
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Songs you&apos;re learning to play
                </p>
              </div>
              <RepertoireSection items={repertoireItems} programId={program.id} />
            </div>

            {/* ── Divider ── */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Technical Levels</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* ── Levels section ── */}
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground">
                    {program.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {levels.length} {levels.length === 1 ? "level" : "levels"}
                  </p>
                </div>
                <AddLevelButton programId={program.id} />
              </div>

              {levels.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-card/30 px-6 py-10 text-center">
                  <p className="text-sm text-muted-foreground">
                    No levels yet — click <strong className="text-foreground">Add Level</strong> to get started.
                  </p>
                </div>
              ) : (
                <LevelAccordion levels={levels} />
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
