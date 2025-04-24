/*
  Warnings:

  - Changed the type of `blingId` on the `products` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "blingId",
ADD COLUMN     "blingId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "products_blingId_key" ON "products"("blingId");

-- CreateIndex
CREATE UNIQUE INDEX "products_organization_id_blingId_key" ON "products"("organization_id", "blingId");
