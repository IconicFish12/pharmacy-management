/*
  Warnings:

  - You are about to drop the column `medicine_id` on the `medicine_orders` table. All the data in the column will be lost.
  - You are about to drop the column `quantitiy` on the `medicine_orders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "medicine_orders" DROP CONSTRAINT "medicine_orders_medicine_id_fkey";

-- AlterTable
ALTER TABLE "medicine_orders" DROP COLUMN "medicine_id",
DROP COLUMN "quantitiy";
