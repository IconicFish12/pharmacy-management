/*
  Warnings:

  - You are about to drop the column `resourceId` on the `ActivityLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ActivityLog" DROP COLUMN "resourceId",
ADD COLUMN     "resource_id" TEXT;
