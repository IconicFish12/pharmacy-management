/*
  Warnings:

  - You are about to drop the column `user_id` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `medicine_orders` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `employee_id` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meployee_id` to the `activity_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employee_id` to the `medicine_orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_user_id_fkey";

-- DropForeignKey
ALTER TABLE "activity_logs" DROP CONSTRAINT "activity_logs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "medicine_orders" DROP CONSTRAINT "medicine_orders_user_id_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "user_id",
ADD COLUMN     "employee_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "activity_logs" DROP COLUMN "user_id",
ADD COLUMN     "meployee_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "medicine_orders" DROP COLUMN "user_id",
ADD COLUMN     "employee_id" UUID NOT NULL;

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "employees" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "emp_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT,
    "role" "Role" NOT NULL,
    "shift" "Shift" NOT NULL,
    "status" "ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "date_of_birth" TIMESTAMP(3),
    "alamat" TEXT,
    "profile_avatar" TEXT,
    "salary" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "employees_phone_number_key" ON "employees"("phone_number");

-- CreateIndex
CREATE INDEX "employee_index" ON "employees"("name", "emp_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "employees_emp_id_email_phone_number_key" ON "employees"("emp_id", "email", "phone_number");

-- CreateIndex
CREATE INDEX "transaction_index" ON "Transaction"("transaction_code", "employee_id");

-- CreateIndex
CREATE INDEX "log_index" ON "activity_logs"("action", "meployee_id", "resource_type", "resource_id");

-- CreateIndex
CREATE INDEX "medicine_category_index" ON "medicine_categories"("category_name", "created_at");

-- CreateIndex
CREATE INDEX "order_index" ON "medicine_orders"("order_code", "order_date", "employee_id", "supplier_id");

-- CreateIndex
CREATE INDEX "medicine_index" ON "medicines"("medicine_name", "sku", "stock", "price", "category_id");

-- CreateIndex
CREATE INDEX "order_detail_index" ON "order_details"("order_id", "medicine_id", "quantity");

-- CreateIndex
CREATE INDEX "supplier_index" ON "suppliers"("supplier_name", "phone_number", "contact_person");

-- CreateIndex
CREATE INDEX "transaction_detail_index" ON "transaction_details"("transaction_id", "medicine_id", "quantity");

-- AddForeignKey
ALTER TABLE "medicine_orders" ADD CONSTRAINT "medicine_orders_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_meployee_id_fkey" FOREIGN KEY ("meployee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
