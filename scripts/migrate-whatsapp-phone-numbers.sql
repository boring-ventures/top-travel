-- Migration script to add phoneNumbers array and migrate existing phoneNumber data
-- This script should be run after the schema migration

-- First, add the phoneNumbers column as an array
ALTER TABLE "WhatsAppTemplate" ADD COLUMN "phoneNumbers" TEXT[];

-- Migrate existing phoneNumber data to phoneNumbers array
UPDATE "WhatsAppTemplate" 
SET "phoneNumbers" = ARRAY["phoneNumber"] 
WHERE "phoneNumber" IS NOT NULL AND "phoneNumbers" IS NULL;

-- Make phoneNumbers NOT NULL after migration
ALTER TABLE "WhatsAppTemplate" ALTER COLUMN "phoneNumbers" SET NOT NULL;

-- Optional: Keep phoneNumber column for backward compatibility during transition
-- ALTER TABLE "WhatsAppTemplate" DROP COLUMN "phoneNumber";
