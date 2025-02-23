/*
  Warnings:

  - You are about to drop the `Request` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RequestItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RETURN_REQUESTS" DROP CONSTRAINT "RETURN_REQUESTS_item_id_fkey";

-- DropForeignKey
ALTER TABLE "RETURN_REQUESTS" DROP CONSTRAINT "RETURN_REQUESTS_request_codreq_fkey";

-- DropForeignKey
ALTER TABLE "RequestItem" DROP CONSTRAINT "RequestItem_ingredient_id_fkey";

-- DropForeignKey
ALTER TABLE "RequestItem" DROP CONSTRAINT "RequestItem_request_id_fkey";

-- DropTable
DROP TABLE "Request";

-- DropTable
DROP TABLE "RequestItem";

-- CreateTable
CREATE TABLE "REQUESTS" (
    "id" TEXT NOT NULL,
    "codreq" SERIAL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_user" TEXT NOT NULL,

    CONSTRAINT "REQUESTS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "REQUESTS_ITEMS" (
    "id" TEXT NOT NULL,
    "codreqite" SERIAL,
    "qtdEst" TEXT NOT NULL,
    "priceUnit" TEXT NOT NULL,
    "priceTotal" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ingredient_id" TEXT NOT NULL,
    "request_id" TEXT NOT NULL,

    CONSTRAINT "REQUESTS_ITEMS_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "REQUESTS_codreq_key" ON "REQUESTS"("codreq");

-- CreateIndex
CREATE UNIQUE INDEX "REQUESTS_ITEMS_codreqite_key" ON "REQUESTS_ITEMS"("codreqite");

-- AddForeignKey
ALTER TABLE "REQUESTS_ITEMS" ADD CONSTRAINT "REQUESTS_ITEMS_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "INGREDIENTS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "REQUESTS_ITEMS" ADD CONSTRAINT "REQUESTS_ITEMS_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "REQUESTS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RETURN_REQUESTS" ADD CONSTRAINT "RETURN_REQUESTS_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "REQUESTS_ITEMS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RETURN_REQUESTS" ADD CONSTRAINT "RETURN_REQUESTS_request_codreq_fkey" FOREIGN KEY ("request_codreq") REFERENCES "REQUESTS"("codreq") ON DELETE CASCADE ON UPDATE CASCADE;
