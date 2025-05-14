/*
  Warnings:

  - You are about to drop the column `commissionPercent` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `orderNumber` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `organization_id` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `services` table. All the data in the column will be lost.
  - You are about to drop the `commissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `projects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_orders` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[mainNumber]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - Made the column `mainNumber` on table `customers` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `descriptionid` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schedule_date` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schedule_time` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `services` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "CommissionTarget" AS ENUM ('NEXT', 'CURRENT');

-- DropForeignKey
ALTER TABLE "commissions" DROP CONSTRAINT "commissions_member_id_fkey";

-- DropForeignKey
ALTER TABLE "commissions" DROP CONSTRAINT "commissions_order_id_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "service_orders" DROP CONSTRAINT "service_orders_orderId_fkey";

-- DropForeignKey
ALTER TABLE "service_orders" DROP CONSTRAINT "service_orders_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_organization_id_fkey";

-- DropIndex
DROP INDEX "customers_document_key";

-- AlterTable
ALTER TABLE "customers" ALTER COLUMN "mainNumber" SET NOT NULL;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "commissionPercent",
DROP COLUMN "orderNumber",
ADD COLUMN     "descriptionid" TEXT NOT NULL,
ADD COLUMN     "order_number" SERIAL NOT NULL,
ADD COLUMN     "schedule_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "schedule_time" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "services" DROP COLUMN "organization_id",
DROP COLUMN "price",
DROP COLUMN "title",
ALTER COLUMN "description" SET NOT NULL;

-- DropTable
DROP TABLE "commissions";

-- DropTable
DROP TABLE "projects";

-- DropTable
DROP TABLE "service_orders";

-- CreateTable
CREATE TABLE "commissions_base" (
    "id" TEXT NOT NULL,
    "base" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "target" BOOLEAN NOT NULL DEFAULT false,
    "memberid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commissions_base_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "single_commissions" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "flag" "CommissionTarget" NOT NULL DEFAULT 'CURRENT',
    "memberid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "single_commissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OrderToSingleCommission" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OrderToSingleCommission_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "commissions_base_memberid_key" ON "commissions_base"("memberid");

-- CreateIndex
CREATE INDEX "_OrderToSingleCommission_B_index" ON "_OrderToSingleCommission"("B");

-- CreateIndex
CREATE UNIQUE INDEX "customers_mainNumber_key" ON "customers"("mainNumber");

-- AddForeignKey
ALTER TABLE "commissions_base" ADD CONSTRAINT "commissions_base_memberid_fkey" FOREIGN KEY ("memberid") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "single_commissions" ADD CONSTRAINT "single_commissions_memberid_fkey" FOREIGN KEY ("memberid") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_descriptionid_fkey" FOREIGN KEY ("descriptionid") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderToSingleCommission" ADD CONSTRAINT "_OrderToSingleCommission_A_fkey" FOREIGN KEY ("A") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderToSingleCommission" ADD CONSTRAINT "_OrderToSingleCommission_B_fkey" FOREIGN KEY ("B") REFERENCES "single_commissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
