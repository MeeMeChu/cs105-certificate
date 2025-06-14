/*
  Warnings:

  - You are about to drop the column `name` on the `Signature` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `Signature` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Signature` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Signature" (
    "sigId" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Signature" ("createdAt", "imagePath", "sigId", "updatedAt") SELECT "createdAt", "imagePath", "sigId", "updatedAt" FROM "Signature";
DROP TABLE "Signature";
ALTER TABLE "new_Signature" RENAME TO "Signature";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
