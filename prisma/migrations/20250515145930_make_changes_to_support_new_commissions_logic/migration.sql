/*
  Warnings:

  - You are about to drop the column `description_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `payment_feed_id` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the `description_services` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[payment_fee_id]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `payment_fee_id` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_description_id_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_payment_feed_id_fkey";

-- DropIndex
DROP INDEX "orders_description_id_key";

-- DropIndex
DROP INDEX "orders_id_description_id_key";

-- DropIndex
DROP INDEX "payments_payment_feed_id_key";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "description_id";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "payment_feed_id",
ADD COLUMN     "payment_fee_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "description_services";

-- CreateTable
CREATE TABLE "service_notes" (
    "id" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "service_notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "service_notes_orderId_idx" ON "service_notes"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_payment_fee_id_key" ON "payments"("payment_fee_id");

-- AddForeignKey
ALTER TABLE "service_notes" ADD CONSTRAINT "service_notes_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_payment_fee_id_fkey" FOREIGN KEY ("payment_fee_id") REFERENCES "payment_fees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
