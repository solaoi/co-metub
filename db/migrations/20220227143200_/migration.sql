-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "basePath" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "memo" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Project" ("basePath", "createdAt", "createdBy", "id", "name", "updatedAt", "updatedBy") SELECT "basePath", "createdAt", "createdBy", "id", "name", "updatedAt", "updatedBy" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_name_key" ON "Project"("name");
CREATE UNIQUE INDEX "Project_basePath_key" ON "Project"("basePath");
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
    "ntimesErrorStatusCode" TEXT NOT NULL DEFAULT '500',
    "ntimesErrorCounter" INTEGER NOT NULL DEFAULT 0,
    "memo" TEXT NOT NULL DEFAULT '',
    "projectId" INTEGER NOT NULL,
    CONSTRAINT "Stub_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Stub" ("contentType", "createdAt", "createdBy", "id", "logs", "method", "ntimesError", "ntimesErrorCounter", "ntimesErrorStatusCode", "path", "projectId", "response", "sleep", "statusCode", "updatedAt", "updatedBy") SELECT "contentType", "createdAt", "createdBy", "id", "logs", "method", "ntimesError", "ntimesErrorCounter", "ntimesErrorStatusCode", "path", "projectId", "response", "sleep", "statusCode", "updatedAt", "updatedBy" FROM "Stub";
DROP TABLE "Stub";
ALTER TABLE "new_Stub" RENAME TO "Stub";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
