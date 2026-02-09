/*
  Warnings:

  - Added the required column `medicine_id` to the `medicine_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantitiy` to the `medicine_orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "medicine_orders" ADD COLUMN     "medicine_id" UUID NOT NULL,
ADD COLUMN     "quantitiy" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "medicine_orders" ADD CONSTRAINT "medicine_orders_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "medicines"("id") ON DELETE CASCADE ON UPDATE CASCADE;
