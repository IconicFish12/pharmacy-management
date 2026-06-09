/*
  Warnings:

  - You are about to drop the column `meployee_id` on the `activity_logs` table. All the data in the column will be lost.
  - Added the required column `employee_id` to the `activity_logs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "activity_logs" DROP CONSTRAINT "activity_logs_meployee_id_fkey";

-- DropIndex
DROP INDEX "log_index";

-- AlterTable
ALTER TABLE "activity_logs" DROP COLUMN "meployee_id",
ADD COLUMN     "employee_id" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "log_index" ON "activity_logs"("action", "employee_id", "resource_type", "resource_id");

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
