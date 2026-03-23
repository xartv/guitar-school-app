-- CreateTable
CREATE TABLE "RepertoireItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "notes" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "programId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RepertoireItem_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RepertoireLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "repertoireItemId" TEXT NOT NULL,
    CONSTRAINT "RepertoireLink_repertoireItemId_fkey" FOREIGN KEY ("repertoireItemId") REFERENCES "RepertoireItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
