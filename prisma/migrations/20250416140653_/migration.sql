/*
  Warnings:

  - The values [DEPÓSITO] on the enum `PaymentType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentType_new" AS ENUM ('PIX', 'CARTAO', 'BOLETO', 'DINHEIRO', 'DEPOSITO', 'PENDENTE');
ALTER TABLE "payments" ALTER COLUMN "method" TYPE "PaymentType_new" USING ("method"::text::"PaymentType_new");
ALTER TYPE "PaymentType" RENAME TO "PaymentType_old";
ALTER TYPE "PaymentType_new" RENAME TO "PaymentType";
DROP TYPE "PaymentType_old";
COMMIT;
