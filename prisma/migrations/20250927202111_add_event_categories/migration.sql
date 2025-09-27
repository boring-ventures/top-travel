-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('MUSIC', 'SPORTS', 'SPECIAL');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "category" "EventCategory";

-- CreateIndex
CREATE INDEX "Event_category_idx" ON "Event"("category");
