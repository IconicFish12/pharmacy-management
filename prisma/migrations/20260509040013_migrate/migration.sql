-- CreateEnum
CREATE TYPE "ActiveStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "Shift" AS ENUM ('MORNING', 'NOON', 'NIGHT');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'OWNER', 'PHARMACIST', 'CASHIER');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "employees" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "emp_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
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

-- CreateTable
CREATE TABLE "suppliers" (
    "id" UUID NOT NULL,
    "supplier_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "contact_person" TEXT,
    "contact_person_number" TEXT,
    "status" "ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "address" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicine_categories" (
    "id" UUID NOT NULL,
    "category_name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "medicine_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicines" (
    "id" UUID NOT NULL,
    "medicine_name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "description" TEXT,
    "category_id" UUID NOT NULL,
    "supplier_id" UUID NOT NULL,
    "stock" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "expired_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "medicines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicine_orders" (
    "id" UUID NOT NULL,
    "order_code" TEXT NOT NULL,
    "order_date" TIMESTAMP NOT NULL,
    "employee_id" UUID NOT NULL,
    "supplier_id" UUID NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "medicine_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_details" (
    "order_id" UUID NOT NULL,
    "medicine_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "order_details_pkey" PRIMARY KEY ("order_id","medicine_id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" UUID NOT NULL,
    "transaction_code" TEXT NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "employee_id" UUID NOT NULL,
    "transaction_date" TIMESTAMP NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_details" (
    "transaction_id" UUID NOT NULL,
    "medicine_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "transaction_details_pkey" PRIMARY KEY ("transaction_id","medicine_id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "meployee_id" UUID NOT NULL,
    "resource_type" TEXT,
    "resource_id" TEXT,
    "payload_data" JSONB,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "employee_index" ON "employees"("name", "emp_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "employees_emp_id_email_phone_number_password_key" ON "employees"("emp_id", "email", "phone_number", "password");

-- CreateIndex
CREATE INDEX "supplier_index" ON "suppliers"("supplier_name", "phone_number", "contact_person");

-- CreateIndex
CREATE INDEX "medicine_category_index" ON "medicine_categories"("category_name", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "medicines_sku_key" ON "medicines"("sku");

-- CreateIndex
CREATE INDEX "medicine_index" ON "medicines"("medicine_name", "sku", "stock", "price", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "medicine_orders_order_code_key" ON "medicine_orders"("order_code");

-- CreateIndex
CREATE INDEX "order_index" ON "medicine_orders"("order_code", "order_date", "employee_id", "supplier_id");

-- CreateIndex
CREATE INDEX "order_detail_index" ON "order_details"("order_id", "medicine_id", "quantity");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_transaction_code_key" ON "Transaction"("transaction_code");

-- CreateIndex
CREATE INDEX "transaction_index" ON "Transaction"("transaction_code", "employee_id");

-- CreateIndex
CREATE INDEX "transaction_detail_index" ON "transaction_details"("transaction_id", "medicine_id", "quantity");

-- CreateIndex
CREATE INDEX "log_index" ON "activity_logs"("action", "meployee_id", "resource_type", "resource_id");

-- AddForeignKey
ALTER TABLE "medicines" ADD CONSTRAINT "medicines_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "medicine_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicines" ADD CONSTRAINT "medicines_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicine_orders" ADD CONSTRAINT "medicine_orders_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicine_orders" ADD CONSTRAINT "medicine_orders_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_details" ADD CONSTRAINT "order_details_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "medicine_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_details" ADD CONSTRAINT "order_details_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "medicines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_details" ADD CONSTRAINT "transaction_details_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_details" ADD CONSTRAINT "transaction_details_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "medicines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_meployee_id_fkey" FOREIGN KEY ("meployee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
