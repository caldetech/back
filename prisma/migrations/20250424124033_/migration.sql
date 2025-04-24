/*
  Warnings:

  - You are about to drop the column `cost_price` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `sales_price` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[blingId]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organization_id,blingId]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `blingId` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "cost_price",
DROP COLUMN "description",
DROP COLUMN "sales_price",
DROP COLUMN "stock",
DROP COLUMN "title",
ADD COLUMN     "blingId" TEXT NOT NULL,
ADD COLUMN     "nome" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "products_blingId_key" ON "products"("blingId");

-- CreateIndex
CREATE UNIQUE INDEX "products_organization_id_blingId_key" ON "products"("organization_id", "blingId");
