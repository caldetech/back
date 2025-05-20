/*
  Warnings:

  - You are about to drop the column `orderAttachmentId` on the `orders` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `order_attachments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_orderAttachmentId_fkey";

-- AlterTable
ALTER TABLE "order_attachments" ADD COLUMN     "orderId" TEXT;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "orderAttachmentId";

-- CreateIndex
CREATE UNIQUE INDEX "order_attachments_orderId_key" ON "order_attachments"("orderId");

-- AddForeignKey
ALTER TABLE "order_attachments" ADD CONSTRAINT "order_attachments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
