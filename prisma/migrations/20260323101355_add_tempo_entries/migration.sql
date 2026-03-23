/*
  Warnings:

  - You are about to drop the column `tempo` on the `Skill` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "TempoEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quarterBpm" INTEGER NOT NULL,
    "skillId" TEXT NOT NULL,
    CONSTRAINT "TempoEntry_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Skill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "notes" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "levelId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Skill_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Skill" ("completed", "createdAt", "id", "levelId", "notes", "title") SELECT "completed", "createdAt", "id", "levelId", "notes", "title" FROM "Skill";
DROP TABLE "Skill";
ALTER TABLE "new_Skill" RENAME TO "Skill";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
