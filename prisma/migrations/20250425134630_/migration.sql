/*
  Warnings:

  - A unique constraint covering the columns `[order_id]` on the table `order_attachments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "order_attachments_order_id_key" ON "order_attachments"("order_id");
