/*
  Warnings:

  - A unique constraint covering the columns `[id,payment_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_payment_id_fkey";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "payment_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "orders_id_payment_id_key" ON "orders"("id", "payment_id");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
