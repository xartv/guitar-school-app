-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Program" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Program_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Program" ("createdAt", "id", "title", "userId") SELECT "createdAt", "id", "title", "userId" FROM "Program";
DROP TABLE "Program";
ALTER TABLE "new_Program" RENAME TO "Program";
CREATE UNIQUE INDEX "Program_userId_key" ON "Program"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
