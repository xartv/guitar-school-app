-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RepertoireLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "repertoireItemId" TEXT NOT NULL,
    CONSTRAINT "RepertoireLink_repertoireItemId_fkey" FOREIGN KEY ("repertoireItemId") REFERENCES "RepertoireItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RepertoireLink" ("id", "repertoireItemId", "url") SELECT "id", "repertoireItemId", "url" FROM "RepertoireLink";
DROP TABLE "RepertoireLink";
ALTER TABLE "new_RepertoireLink" RENAME TO "RepertoireLink";
CREATE TABLE "new_SkillStage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stage" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "skillId" TEXT NOT NULL,
    CONSTRAINT "SkillStage_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SkillStage" ("completed", "id", "skillId", "stage") SELECT "completed", "id", "skillId", "stage" FROM "SkillStage";
DROP TABLE "SkillStage";
ALTER TABLE "new_SkillStage" RENAME TO "SkillStage";
CREATE TABLE "new_YoutubeLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    CONSTRAINT "YoutubeLink_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_YoutubeLink" ("id", "skillId", "url") SELECT "id", "skillId", "url" FROM "YoutubeLink";
DROP TABLE "YoutubeLink";
ALTER TABLE "new_YoutubeLink" RENAME TO "YoutubeLink";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
