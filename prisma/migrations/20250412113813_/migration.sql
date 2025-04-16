/*
  Warnings:

  - You are about to drop the column `assigned_employee_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `comission_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `customer_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `is_hidden` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `max_employees` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `payment_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `dueDay` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `installments` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the `assigned_comissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `assigned_employees` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `comissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment_installments` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `amount` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_id` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `method` on the `payments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "assigned_comissions" DROP CONSTRAINT "assigned_comissions_comission_id_fkey";

-- DropForeignKey
ALTER TABLE "assigned_comissions" DROP CONSTRAINT "assigned_comissions_member_id_fkey";

-- DropForeignKey
ALTER TABLE "assigned_employees" DROP CONSTRAINT "assigned_employees_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_assigned_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_comission_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_payment_id_fkey";

-- DropForeignKey
ALTER TABLE "payment_installments" DROP CONSTRAINT "payment_installments_payment_id_fkey";

-- DropForeignKey
ALTER TABLE "product_orders" DROP CONSTRAINT "product_orders_order_id_fkey";

-- DropForeignKey
ALTER TABLE "service_orders" DROP CONSTRAINT "service_orders_order_id_fkey";

-- DropIndex
DROP INDEX "orders_id_comission_id_key";

-- DropIndex
DROP INDEX "orders_id_customer_id_key";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "assigned_employee_id",
DROP COLUMN "comission_id",
DROP COLUMN "customer_id",
DROP COLUMN "is_hidden",
DROP COLUMN "max_employees",
DROP COLUMN "payment_id";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "dueDay",
DROP COLUMN "installments",
DROP COLUMN "price",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "order_id" TEXT NOT NULL,
ADD COLUMN     "paidAt" TIMESTAMP(3),
DROP COLUMN "method",
ADD COLUMN     "method" "PaymentType" NOT NULL;

-- DropTable
DROP TABLE "assigned_comissions";

-- DropTable
DROP TABLE "assigned_employees";

-- DropTable
DROP TABLE "comissions";

-- DropTable
DROP TABLE "payment_installments";

-- CreateTable
CREATE TABLE "assigned_members" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assigned_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_commissions" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_commissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OrderToProductOrder" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OrderToProductOrder_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_OrderToServiceOrder" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OrderToServiceOrder_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "assigned_members_order_id_member_id_key" ON "assigned_members"("order_id", "member_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_commissions_order_id_member_id_key" ON "order_commissions"("order_id", "member_id");

-- CreateIndex
CREATE INDEX "_OrderToProductOrder_B_index" ON "_OrderToProductOrder"("B");

-- CreateIndex
CREATE INDEX "_OrderToServiceOrder_B_index" ON "_OrderToServiceOrder"("B");

-- AddForeignKey
ALTER TABLE "assigned_members" ADD CONSTRAINT "assigned_members_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assigned_members" ADD CONSTRAINT "assigned_members_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_commissions" ADD CONSTRAINT "order_commissions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_commissions" ADD CONSTRAINT "order_commissions_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderToProductOrder" ADD CONSTRAINT "_OrderToProductOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderToProductOrder" ADD CONSTRAINT "_OrderToProductOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "product_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderToServiceOrder" ADD CONSTRAINT "_OrderToServiceOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderToServiceOrder" ADD CONSTRAINT "_OrderToServiceOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "service_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
