-- CreateTable
CREATE TABLE "Certificate" (
    "cerId" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "templatePath" TEXT,
    "outputPath" TEXT,
    "textX" REAL NOT NULL,
    "textY" REAL NOT NULL,
    "textWidth" REAL,
    "textHeight" REAL,
    "fontSize" REAL,
    "fontFamily" TEXT,
    "textColor" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Certificate_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Signature" (
    "sigId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SignaturePosition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "certificateId" TEXT NOT NULL,
    "signatureId" TEXT NOT NULL,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "width" REAL,
    "height" REAL,
    CONSTRAINT "SignaturePosition_certificateId_fkey" FOREIGN KEY ("certificateId") REFERENCES "Certificate" ("cerId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SignaturePosition_signatureId_fkey" FOREIGN KEY ("signatureId") REFERENCES "Signature" ("sigId") ON DELETE CASCADE ON UPDATE CASCADE
);
