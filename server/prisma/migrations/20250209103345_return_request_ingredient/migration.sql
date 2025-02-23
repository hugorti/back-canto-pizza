/*
  Warnings:

  - Added the required column `ingredient_id` to the `RETURN_REQUESTS` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RETURN_REQUESTS" ADD COLUMN     "ingredient_id" TEXT NOT NULL,
ALTER COLUMN "codretreq" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Request" ALTER COLUMN "codreq" DROP NOT NULL;

-- AlterTable
ALTER TABLE "RequestItem" ALTER COLUMN "codreqite" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "RETURN_REQUESTS" ADD CONSTRAINT "RETURN_REQUESTS_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "INGREDIENTS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
