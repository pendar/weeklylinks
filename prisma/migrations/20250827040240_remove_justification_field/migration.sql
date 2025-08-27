/*
  Warnings:

  - You are about to drop the column `justification` on the `Card` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Card" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "colorScheme" TEXT NOT NULL DEFAULT 'light',
    "type" TEXT NOT NULL,
    "backgroundUrl" TEXT,
    "backgroundBlur" TEXT,
    "themeId" TEXT,
    "categoryId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "position" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Card_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Card_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Card" ("backgroundBlur", "backgroundUrl", "categoryId", "colorScheme", "createdAt", "description", "id", "position", "publishedAt", "sourceName", "sourceUrl", "status", "themeId", "title", "type", "updatedAt") SELECT "backgroundBlur", "backgroundUrl", "categoryId", "colorScheme", "createdAt", "description", "id", "position", "publishedAt", "sourceName", "sourceUrl", "status", "themeId", "title", "type", "updatedAt" FROM "Card";
DROP TABLE "Card";
ALTER TABLE "new_Card" RENAME TO "Card";
CREATE INDEX "Card_status_publishedAt_idx" ON "Card"("status", "publishedAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
