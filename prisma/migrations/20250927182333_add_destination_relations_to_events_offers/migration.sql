-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "destinationId" TEXT;

-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "destinationId" TEXT;

-- CreateIndex
CREATE INDEX "Event_destinationId_idx" ON "Event"("destinationId");

-- CreateIndex
CREATE INDEX "Offer_destinationId_idx" ON "Offer"("destinationId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE SET NULL ON UPDATE CASCADE;
