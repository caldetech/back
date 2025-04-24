/*
  Warnings:

  - You are about to drop the column `order_id` on the `product_orders` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `product_orders` table. All the data in the column will be lost.
  - You are about to drop the `_OrderToProductOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_OrderToServiceOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_orders` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[orderid,productid]` on the table `product_orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,orderid]` on the table `product_orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderid` to the `product_orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_OrderToProductOrder" DROP CONSTRAINT "_OrderToProductOrder_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderToProductOrder" DROP CONSTRAINT "_OrderToProductOrder_B_fkey";

-- DropForeignKey
ALTER TABLE "_OrderToServiceOrder" DROP CONSTRAINT "_OrderToServiceOrder_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderToServiceOrder" DROP CONSTRAINT "_OrderToServiceOrder_B_fkey";

-- DropForeignKey
ALTER TABLE "order_attachments" DROP CONSTRAINT "order_attachments_order_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "product_orders" DROP CONSTRAINT "product_orders_product_id_fkey";

-- DropForeignKey
ALTER TABLE "service_orders" DROP CONSTRAINT "service_orders_service_id_fkey";

-- DropIndex
DROP INDEX "product_orders_order_id_product_id_key";

-- AlterTable
ALTER TABLE "order_attachments" ALTER COLUMN "order_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "owner_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "product_orders" DROP COLUMN "order_id",
DROP COLUMN "product_id",
ADD COLUMN     "orderid" TEXT NOT NULL,
ADD COLUMN     "productid" TEXT;

-- DropTable
DROP TABLE "_OrderToProductOrder";

-- DropTable
DROP TABLE "_OrderToServiceOrder";

-- DropTable
DROP TABLE "service_orders";

-- CreateIndex
CREATE UNIQUE INDEX "product_orders_orderid_productid_key" ON "product_orders"("orderid", "productid");

-- CreateIndex
CREATE UNIQUE INDEX "product_orders_id_orderid_key" ON "product_orders"("id", "orderid");

-- AddForeignKey
ALTER TABLE "product_orders" ADD CONSTRAINT "product_orders_orderid_fkey" FOREIGN KEY ("orderid") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_orders" ADD CONSTRAINT "product_orders_productid_fkey" FOREIGN KEY ("productid") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_attachments" ADD CONSTRAINT "order_attachments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
