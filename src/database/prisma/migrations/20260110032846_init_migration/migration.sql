-- CreateEnum
CREATE TYPE "Shift" AS ENUM ('MORNING', 'NOON', 'NIGHT');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'OWNER', 'PHARMACIST', 'CASHIER');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "emp_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "shift" "Shift" NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "alamat" TEXT NOT NULL,
    "profile_avatar" TEXT NOT NULL,
    "salary" INTEGER NOT NULL,
    "start_date" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_password_key" ON "User"("password");
