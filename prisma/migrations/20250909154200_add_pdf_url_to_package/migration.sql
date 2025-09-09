/*
  Warnings:

  - You are about to drop the column `featuredItemRefs` on the `Department` table. All the data in the column will be lost.
  - You are about to drop the column `displayTag` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the `Page` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "Offer_displayTag_idx";

-- AlterTable
ALTER TABLE "Department" DROP COLUMN "featuredItemRefs",
ADD COLUMN     "additionalContentJson" JSONB,
ADD COLUMN     "contactInfoJson" JSONB,
ADD COLUMN     "heroContentJson" JSONB,
ADD COLUMN     "packagesJson" JSONB,
ADD COLUMN     "servicesJson" JSONB;

-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "displayTag";

-- AlterTable
ALTER TABLE "Package" ADD COLUMN     "pdfUrl" TEXT;

-- DropTable
DROP TABLE "Page";

-- CreateTable
CREATE TABLE "event_tags" (
    "eventId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "event_tags_pkey" PRIMARY KEY ("eventId","tagId")
);

-- CreateTable
CREATE TABLE "offer_tags" (
    "offerId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "offer_tags_pkey" PRIMARY KEY ("offerId","tagId")
);

-- CreateTable
CREATE TABLE "WeddingDestination" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "heroImageUrl" TEXT,
    "gallery" JSONB,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeddingDestination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuinceaneraDestination" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "heroImageUrl" TEXT,
    "gallery" JSONB,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuinceaneraDestination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "heroImageUrl" TEXT,
    "author" TEXT,
    "publishedAt" TIMESTAMP(3),
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "type" "DepartmentType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "event_tags_tagId_idx" ON "event_tags"("tagId");

-- CreateIndex
CREATE INDEX "offer_tags_tagId_idx" ON "offer_tags"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "WeddingDestination_slug_key" ON "WeddingDestination"("slug");

-- CreateIndex
CREATE INDEX "WeddingDestination_isFeatured_idx" ON "WeddingDestination"("isFeatured");

-- CreateIndex
CREATE UNIQUE INDEX "QuinceaneraDestination_slug_key" ON "QuinceaneraDestination"("slug");

-- CreateIndex
CREATE INDEX "QuinceaneraDestination_isFeatured_idx" ON "QuinceaneraDestination"("isFeatured");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_status_idx" ON "BlogPost"("status");

-- CreateIndex
CREATE INDEX "BlogPost_publishedAt_idx" ON "BlogPost"("publishedAt");

-- CreateIndex
CREATE INDEX "BlogPost_type_idx" ON "BlogPost"("type");

-- AddForeignKey
ALTER TABLE "event_tags" ADD CONSTRAINT "event_tags_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_tags" ADD CONSTRAINT "event_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer_tags" ADD CONSTRAINT "offer_tags_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer_tags" ADD CONSTRAINT "offer_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
