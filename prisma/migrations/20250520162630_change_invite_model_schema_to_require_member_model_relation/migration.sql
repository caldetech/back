/*
  Warnings:

  - You are about to drop the column `author_id` on the `invites` table. All the data in the column will be lost.
  - Added the required column `member_id` to the `invites` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "invites" DROP CONSTRAINT "invites_author_id_fkey";

-- AlterTable
ALTER TABLE "invites" DROP COLUMN "author_id",
ADD COLUMN     "member_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
