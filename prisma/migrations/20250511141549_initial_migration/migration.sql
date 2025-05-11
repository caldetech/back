-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "orderNumber" SERIAL NOT NULL,
ADD COLUMN     "show" BOOLEAN NOT NULL DEFAULT true;
