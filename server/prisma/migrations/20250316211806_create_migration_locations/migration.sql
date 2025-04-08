/*
  Warnings:

  - Added the required column `location_id` to the `INGREDIENTS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location_id` to the `PRODUCTS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location_id` to the `USERS` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GROUPS" ALTER COLUMN "codgru" DROP NOT NULL;

-- AlterTable
ALTER TABLE "INGREDIENTS" ADD COLUMN     "location_id" TEXT NOT NULL,
ALTER COLUMN "coding" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MOVIMENTS" ALTER COLUMN "codmov" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PRODUCTS" ADD COLUMN     "location_id" TEXT NOT NULL,
ALTER COLUMN "codpro" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PRODUCT_INGREDIENTS" ALTER COLUMN "codpin" DROP NOT NULL;

-- AlterTable
ALTER TABLE "REQUESTS" ALTER COLUMN "codreq" DROP NOT NULL;

-- AlterTable
ALTER TABLE "REQUESTS_ITEMS" ALTER COLUMN "codreqite" DROP NOT NULL;

-- AlterTable
ALTER TABLE "RETURN_REQUESTS" ALTER COLUMN "codretreq" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ROLES" ALTER COLUMN "codrol" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SALES" ALTER COLUMN "codsal" DROP NOT NULL;

-- AlterTable
ALTER TABLE "USERS" ADD COLUMN     "location_id" TEXT NOT NULL,
ALTER COLUMN "codusu" DROP NOT NULL;

-- CreateTable
CREATE TABLE "LOCATIONS" (
    "id" TEXT NOT NULL,
    "codloc" SERIAL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_user" TEXT,
    "updated_user" TEXT,

    CONSTRAINT "LOCATIONS_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LOCATIONS_codloc_key" ON "LOCATIONS"("codloc");

-- AddForeignKey
ALTER TABLE "USERS" ADD CONSTRAINT "USERS_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "LOCATIONS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "INGREDIENTS" ADD CONSTRAINT "INGREDIENTS_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "LOCATIONS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PRODUCTS" ADD CONSTRAINT "PRODUCTS_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "LOCATIONS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
