/*
  Warnings:

  - Added the required column `customerid` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "customerid" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerid_fkey" FOREIGN KEY ("customerid") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
