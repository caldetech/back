-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('ACCEPTED', 'PENDING');

-- AlterTable
ALTER TABLE "invites" ADD COLUMN     "status" "InviteStatus" NOT NULL DEFAULT 'PENDING';
