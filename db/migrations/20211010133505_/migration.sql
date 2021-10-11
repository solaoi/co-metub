/*
  Warnings:

  - Added the required column `ntimesErrorStatusCode` to the `Stub` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Stub" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "statusCode" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "sleep" INTEGER NOT NULL DEFAULT 0,
    "logs" TEXT NOT NULL,
    "ntimesError" INTEGER NOT NULL DEFAULT 0,
    "ntimesErrorStatusCode" TEXT NOT NULL DEFAULT "500",
    "ntimesErrorCounter" INTEGER NOT NULL DEFAULT 0,
    "projectId" INTEGER NOT NULL,
    CONSTRAINT "Stub_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Stub" ("contentType", "createdAt", "createdBy", "id", "logs", "method", "path", "projectId", "response", "sleep", "statusCode", "updatedAt", "updatedBy") SELECT "contentType", "createdAt", "createdBy", "id", "logs", "method", "path", "projectId", "response", "sleep", "statusCode", "updatedAt", "updatedBy" FROM "Stub";
DROP TABLE "Stub";
ALTER TABLE "new_Stub" RENAME TO "Stub";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
