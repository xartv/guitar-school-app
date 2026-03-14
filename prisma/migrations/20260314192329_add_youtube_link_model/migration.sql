-- CreateTable
CREATE TABLE "YoutubeLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    CONSTRAINT "YoutubeLink_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
