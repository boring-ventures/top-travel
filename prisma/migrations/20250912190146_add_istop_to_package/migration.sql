-- AlterTable
ALTER TABLE "Package" ADD COLUMN     "isTop" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Package_isTop_idx" ON "Package"("isTop");
