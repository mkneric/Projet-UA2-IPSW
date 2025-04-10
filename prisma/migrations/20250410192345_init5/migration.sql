/*
  Warnings:

  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Todo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "priorite" TEXT,
    "date_limite" DATETIME,
    "statut" TEXT NOT NULL DEFAULT 'A_FAIRE',
    "est_faite" BOOLEAN NOT NULL DEFAULT false,
    "auteur" TEXT
);
INSERT INTO "new_Todo" ("auteur", "date_limite", "description", "est_faite", "id", "priorite", "statut") SELECT "auteur", "date_limite", "description", "est_faite", "id", "priorite", "statut" FROM "Todo";
DROP TABLE "Todo";
ALTER TABLE "new_Todo" RENAME TO "Todo";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "nom" TEXT NOT NULL
);
INSERT INTO "new_User" ("id", "nom") SELECT "id", "nom" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
