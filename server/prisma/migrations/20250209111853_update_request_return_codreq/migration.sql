/*
  Warnings:

  - You are about to drop the column `request_id` on the `RETURN_REQUESTS` table. All the data in the column will be lost.
  - Added the required column `request_codreq` to the `RETURN_REQUESTS` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RETURN_REQUESTS" DROP CONSTRAINT "RETURN_REQUESTS_request_id_fkey";

-- AlterTable
ALTER TABLE "RETURN_REQUESTS" DROP COLUMN "request_id",
ADD COLUMN     "request_codreq" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "RETURN_REQUESTS" ADD CONSTRAINT "RETURN_REQUESTS_request_codreq_fkey" FOREIGN KEY ("request_codreq") REFERENCES "Request"("codreq") ON DELETE CASCADE ON UPDATE CASCADE;
