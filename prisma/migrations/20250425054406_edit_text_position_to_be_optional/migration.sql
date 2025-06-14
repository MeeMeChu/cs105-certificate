-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Certificate" (
    "cerId" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "templatePath" TEXT,
    "outputPath" TEXT,
    "textX" REAL,
    "textY" REAL,
    "textWidth" REAL,
    "textHeight" REAL,
    "fontSize" REAL,
    "fontFamily" TEXT,
    "textColor" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Certificate_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Certificate" ("cerId", "createdAt", "eventId", "fontFamily", "fontSize", "name", "outputPath", "templatePath", "textColor", "textHeight", "textWidth", "textX", "textY", "updatedAt") SELECT "cerId", "createdAt", "eventId", "fontFamily", "fontSize", "name", "outputPath", "templatePath", "textColor", "textHeight", "textWidth", "textX", "textY", "updatedAt" FROM "Certificate";
DROP TABLE "Certificate";
ALTER TABLE "new_Certificate" RENAME TO "Certificate";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
