-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TempoEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quarterBpm" INTEGER NOT NULL,
    "skillId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TempoEntry_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TempoEntry" ("id", "quarterBpm", "skillId") SELECT "id", "quarterBpm", "skillId" FROM "TempoEntry";
DROP TABLE "TempoEntry";
ALTER TABLE "new_TempoEntry" RENAME TO "TempoEntry";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
