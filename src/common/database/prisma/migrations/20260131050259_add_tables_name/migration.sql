/*
  Warnings:

  - You are about to drop the `ActivityLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MedicineOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ActivityLog" DROP CONSTRAINT "ActivityLog_user_id_fkey";

-- DropForeignKey
ALTER TABLE "MedicineOrder" DROP CONSTRAINT "MedicineOrder_supplier_id_fkey";

-- DropForeignKey
ALTER TABLE "MedicineOrder" DROP CONSTRAINT "MedicineOrder_user_id_fkey";

-- DropForeignKey
ALTER TABLE "order_details" DROP CONSTRAINT "order_details_order_id_fkey";

-- DropTable
DROP TABLE "ActivityLog";

-- DropTable
DROP TABLE "MedicineOrder";

-- CreateTable
CREATE TABLE "medicine_orders" (
    "id" UUID NOT NULL,
    "medicine_name" TEXT NOT NULL,
    "order_code" TEXT NOT NULL,
    "order_date" TIMESTAMP NOT NULL,
    "user_id" UUID NOT NULL,
    "supplier_id" UUID NOT NULL,
    "total_price" DECIMAL(65,30) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "medicine_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "resource_type" TEXT,
    "resource_id" TEXT,
    "payload_data" JSONB,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "medicine_orders_order_code_key" ON "medicine_orders"("order_code");

-- AddForeignKey
ALTER TABLE "medicine_orders" ADD CONSTRAINT "medicine_orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicine_orders" ADD CONSTRAINT "medicine_orders_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_details" ADD CONSTRAINT "order_details_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "medicine_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
