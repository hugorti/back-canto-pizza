/*
  Warnings:

  - You are about to drop the column `ingredient_id` on the `RETURN_REQUESTS` table. All the data in the column will be lost.
  - Added the required column `item_id` to the `RETURN_REQUESTS` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RETURN_REQUESTS" DROP CONSTRAINT "RETURN_REQUESTS_ingredient_id_fkey";

-- DropForeignKey
ALTER TABLE "RETURN_REQUESTS" DROP CONSTRAINT "RETURN_REQUESTS_request_id_fkey";

-- AlterTable
ALTER TABLE "RETURN_REQUESTS" DROP COLUMN "ingredient_id",
ADD COLUMN     "item_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "RETURN_REQUESTS" ADD CONSTRAINT "RETURN_REQUESTS_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "RequestItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RETURN_REQUESTS" ADD CONSTRAINT "RETURN_REQUESTS_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;
