/*
  Warnings:

  - You are about to drop the column `order_id` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[payment_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `payment_id` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_order_id_fkey";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "payment_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "order_id";

-- CreateIndex
CREATE UNIQUE INDEX "orders_payment_id_key" ON "orders"("payment_id");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
