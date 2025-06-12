/*
  Warnings:

  - You are about to drop the `SignaturePosition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `fontFamily` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `fontSize` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `outputPath` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `textColor` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `textHeight` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `textWidth` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `textX` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `textY` on the `Certificate` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SignaturePosition";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Position" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "certificateId" TEXT NOT NULL,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "fontSize" REAL NOT NULL DEFAULT 24,
    "type" TEXT NOT NULL,
    "width" REAL,
    "height" REAL,
    "signatureId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Position_certificateId_fkey" FOREIGN KEY ("certificateId") REFERENCES "Certificate" ("cerId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Position_signatureId_fkey" FOREIGN KEY ("signatureId") REFERENCES "Signature" ("sigId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Certificate" (
    "cerId" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "name" TEXT,
    "templatePath" TEXT,
    "templateUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Certificate_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Certificate" ("cerId", "createdAt", "eventId", "name", "templatePath", "updatedAt") SELECT "cerId", "createdAt", "eventId", "name", "templatePath", "updatedAt" FROM "Certificate";
DROP TABLE "Certificate";
ALTER TABLE "new_Certificate" RENAME TO "Certificate";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
