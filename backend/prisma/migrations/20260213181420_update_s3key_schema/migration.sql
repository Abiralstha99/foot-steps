-- AlterTable
-- Make url nullable since we're now using s3Key as the primary storage reference
ALTER TABLE "Photo" ALTER COLUMN "url" DROP NOT NULL;
