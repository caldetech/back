-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_customerid_fkey";

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerid_fkey" FOREIGN KEY ("customerid") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
