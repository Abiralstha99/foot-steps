/*
  Warnings:

  - You are about to drop the column `storageKey` on the `Photo` table. All the data in the column will be lost.
  - Added the required column `s3Key` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "storageKey",
ADD COLUMN     "s3Key" TEXT NOT NULL;
