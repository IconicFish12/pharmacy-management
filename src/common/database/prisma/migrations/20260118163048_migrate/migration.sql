/*
  Warnings:

  - Changed the type of `start_date` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "start_date",
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL;
