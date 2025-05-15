/*
  Warnings:

  - You are about to drop the column `memberid` on the `commissions_base` table. All the data in the column will be lost.
  - You are about to drop the column `customerType` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `mainNumber` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `customerid` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `descriptionid` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `paidAt` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `product_orders` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `product_orders` table. All the data in the column will be lost.
  - You are about to drop the column `blingId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `costPrice` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `memberid` on the `single_commissions` table. All the data in the column will be lost.
  - The `flag` column on the `single_commissions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `_OrderToSingleCommission` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[provider_account_id,user_id]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[main_number]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[main_number,organization_id]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[commission_target_id]` on the table `members` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,commission_target_id]` on the table `members` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,organization_id]` on the table `members` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[description_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order_attachment_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,description_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,owner_id]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[payment_feed_id]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order_id,product_id]` on the table `product_orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,order_id]` on the table `product_orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bling_id]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organization_id,bling_id]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[member_id,order_id]` on the table `single_commissions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customer_type` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `main_number` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commission_target_id` to the `members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description_id` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_feed_id` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_id` to the `product_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bling_id` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cost_price` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `member_id` to the `single_commissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_id` to the `single_commissions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CommissionTargetStatus" AS ENUM ('NEXT', 'CURRENT');

-- DropForeignKey
ALTER TABLE "_OrderToSingleCommission" DROP CONSTRAINT "_OrderToSingleCommission_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderToSingleCommission" DROP CONSTRAINT "_OrderToSingleCommission_B_fkey";

-- DropForeignKey
ALTER TABLE "commissions_base" DROP CONSTRAINT "commissions_base_memberid_fkey";

-- DropForeignKey
ALTER TABLE "order_attachments" DROP CONSTRAINT "order_attachments_order_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_customerid_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_descriptionid_fkey";

-- DropForeignKey
ALTER TABLE "product_orders" DROP CONSTRAINT "product_orders_orderId_fkey";

-- DropForeignKey
ALTER TABLE "product_orders" DROP CONSTRAINT "product_orders_productId_fkey";

-- DropForeignKey
ALTER TABLE "single_commissions" DROP CONSTRAINT "single_commissions_memberid_fkey";

-- DropIndex
DROP INDEX "accounts_provider_user_id_key";

-- DropIndex
DROP INDEX "commissions_base_memberid_key";

-- DropIndex
DROP INDEX "customers_mainNumber_key";

-- DropIndex
DROP INDEX "customers_organization_id_document_key";

-- DropIndex
DROP INDEX "invites_email_idx";

-- DropIndex
DROP INDEX "organizations_domain_key";

-- DropIndex
DROP INDEX "product_orders_id_orderId_key";

-- DropIndex
DROP INDEX "product_orders_orderId_productId_key";

-- DropIndex
DROP INDEX "products_blingId_key";

-- DropIndex
DROP INDEX "products_organization_id_blingId_key";

-- DropIndex
DROP INDEX "tokens_id_user_id_key";

-- AlterTable
ALTER TABLE "commissions_base" DROP COLUMN "memberid";

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "customerType",
DROP COLUMN "mainNumber",
ADD COLUMN     "customer_type" "CustomerType" NOT NULL,
ADD COLUMN     "main_number" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "members" ADD COLUMN     "commission_target_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "customerid",
DROP COLUMN "descriptionid",
ADD COLUMN     "customer_id" TEXT,
ADD COLUMN     "description_id" TEXT NOT NULL,
ADD COLUMN     "order_attachment_id" TEXT;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "paidAt",
ADD COLUMN     "paid_at" TIMESTAMP(3),
ADD COLUMN     "payment_feed_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "product_orders" DROP COLUMN "orderId",
DROP COLUMN "productId",
ADD COLUMN     "order_id" TEXT NOT NULL,
ADD COLUMN     "product_id" TEXT;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "blingId",
DROP COLUMN "costPrice",
ADD COLUMN     "bling_id" BIGINT NOT NULL,
ADD COLUMN     "cost_price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "single_commissions" DROP COLUMN "memberid",
ADD COLUMN     "member_id" TEXT NOT NULL,
ADD COLUMN     "order_id" TEXT NOT NULL,
DROP COLUMN "flag",
ADD COLUMN     "flag" "CommissionTargetStatus" NOT NULL DEFAULT 'CURRENT';

-- DropTable
DROP TABLE "_OrderToSingleCommission";

-- DropEnum
DROP TYPE "CommissionTarget";

-- CreateTable
CREATE TABLE "payment_fees" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_fees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_account_id_user_id_key" ON "accounts"("provider_account_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "customers_main_number_key" ON "customers"("main_number");

-- CreateIndex
CREATE UNIQUE INDEX "customers_main_number_organization_id_key" ON "customers"("main_number", "organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "members_commission_target_id_key" ON "members"("commission_target_id");

-- CreateIndex
CREATE UNIQUE INDEX "members_id_commission_target_id_key" ON "members"("id", "commission_target_id");

-- CreateIndex
CREATE UNIQUE INDEX "members_id_organization_id_key" ON "members"("id", "organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_description_id_key" ON "orders"("description_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_attachment_id_key" ON "orders"("order_attachment_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_id_description_id_key" ON "orders"("id", "description_id");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_id_owner_id_key" ON "organizations"("id", "owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_payment_feed_id_key" ON "payments"("payment_feed_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_orders_order_id_product_id_key" ON "product_orders"("order_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_orders_id_order_id_key" ON "product_orders"("id", "order_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_bling_id_key" ON "products"("bling_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_organization_id_bling_id_key" ON "products"("organization_id", "bling_id");

-- CreateIndex
CREATE UNIQUE INDEX "single_commissions_member_id_order_id_key" ON "single_commissions"("member_id", "order_id");

-- AddForeignKey
ALTER TABLE "single_commissions" ADD CONSTRAINT "single_commissions_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "single_commissions" ADD CONSTRAINT "single_commissions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_commission_target_id_fkey" FOREIGN KEY ("commission_target_id") REFERENCES "commissions_base"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_orders" ADD CONSTRAINT "product_orders_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_orders" ADD CONSTRAINT "product_orders_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_description_id_fkey" FOREIGN KEY ("description_id") REFERENCES "description_services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_order_attachment_id_fkey" FOREIGN KEY ("order_attachment_id") REFERENCES "order_attachments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_payment_feed_id_fkey" FOREIGN KEY ("payment_feed_id") REFERENCES "payment_fees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
