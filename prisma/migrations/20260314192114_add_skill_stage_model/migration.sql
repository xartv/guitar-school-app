-- CreateTable
CREATE TABLE "SkillStage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stage" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "skillId" TEXT NOT NULL,
    CONSTRAINT "SkillStage_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
