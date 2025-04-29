/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `LOCATIONS` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "INGREDIENTS_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "LOCATIONS_name_key" ON "LOCATIONS"("name");
