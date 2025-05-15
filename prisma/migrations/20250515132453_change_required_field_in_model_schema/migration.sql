-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_commission_target_id_fkey";

-- AlterTable
ALTER TABLE "members" ALTER COLUMN "commission_target_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_commission_target_id_fkey" FOREIGN KEY ("commission_target_id") REFERENCES "commissions_base"("id") ON DELETE SET NULL ON UPDATE CASCADE;
