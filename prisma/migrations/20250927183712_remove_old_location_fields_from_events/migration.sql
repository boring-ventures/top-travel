/*
  Warnings:

  - You are about to drop the column `locationCity` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `locationCountry` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "locationCity",
DROP COLUMN "locationCountry";
