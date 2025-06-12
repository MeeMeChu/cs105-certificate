-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Position" (
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
    CONSTRAINT "Position_signatureId_fkey" FOREIGN KEY ("signatureId") REFERENCES "Signature" ("sigId") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Position" ("certificateId", "createdAt", "fontSize", "height", "id", "signatureId", "type", "updatedAt", "width", "x", "y") SELECT "certificateId", "createdAt", "fontSize", "height", "id", "signatureId", "type", "updatedAt", "width", "x", "y" FROM "Position";
DROP TABLE "Position";
ALTER TABLE "new_Position" RENAME TO "Position";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
