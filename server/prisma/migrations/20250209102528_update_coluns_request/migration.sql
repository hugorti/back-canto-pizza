/*
  Warnings:

  - A unique constraint covering the columns `[codretreq]` on the table `RETURN_REQUESTS` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codreq]` on the table `Request` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codreqite]` on the table `RequestItem` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RETURN_REQUESTS" ADD COLUMN     "codretreq" SERIAL;

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "codreq" SERIAL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "RequestItem" ADD COLUMN     "codreqite" SERIAL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "RETURN_REQUESTS_codretreq_key" ON "RETURN_REQUESTS"("codretreq");

-- CreateIndex
CREATE UNIQUE INDEX "Request_codreq_key" ON "Request"("codreq");

-- CreateIndex
CREATE UNIQUE INDEX "RequestItem_codreqite_key" ON "RequestItem"("codreqite");
