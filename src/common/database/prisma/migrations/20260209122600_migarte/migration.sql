/*
  Warnings:

  - You are about to alter the column `total_price` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "total_price" SET DATA TYPE DOUBLE PRECISION;
