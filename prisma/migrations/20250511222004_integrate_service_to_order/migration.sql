/*
  Warnings:

  - You are about to drop the column `orderid` on the `product_orders` table. All the data in the column will be lost.
  - You are about to drop the column `productid` on the `product_orders` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderId,productId]` on the table `product_orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,orderId]` on the table `product_orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderId` to the `product_orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "product_orders" DROP CONSTRAINT "product_orders_orderid_fkey";

-- DropForeignKey
ALTER TABLE "product_orders" DROP CONSTRAINT "product_orders_productid_fkey";

-- DropIndex
DROP INDEX "product_orders_id_orderid_key";

-- DropIndex
DROP INDEX "product_orders_orderid_productid_key";

-- AlterTable
ALTER TABLE "product_orders" DROP COLUMN "orderid",
DROP COLUMN "productid",
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "productId" TEXT;

-- CreateTable
CREATE TABLE "service_orders" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "orderId" TEXT NOT NULL,
    "serviceId" TEXT,

    CONSTRAINT "service_orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "service_orders_orderId_serviceId_key" ON "service_orders"("orderId", "serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "service_orders_id_orderId_key" ON "service_orders"("id", "orderId");

-- CreateIndex
CREATE UNIQUE INDEX "product_orders_orderId_productId_key" ON "product_orders"("orderId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "product_orders_id_orderId_key" ON "product_orders"("id", "orderId");

-- AddForeignKey
ALTER TABLE "product_orders" ADD CONSTRAINT "product_orders_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_orders" ADD CONSTRAINT "product_orders_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_orders" ADD CONSTRAINT "service_orders_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_orders" ADD CONSTRAINT "service_orders_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;
