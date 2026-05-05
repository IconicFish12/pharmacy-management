/*
  Warnings:

  - A unique constraint covering the columns `[emp_id,email,phone_number,password]` on the table `employees` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "employees_email_key";

-- DropIndex
DROP INDEX "employees_emp_id_email_phone_number_key";

-- DropIndex
DROP INDEX "employees_phone_number_key";

-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "password" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "employees_emp_id_email_phone_number_password_key" ON "employees"("emp_id", "email", "phone_number", "password");
