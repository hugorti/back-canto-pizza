-- DropForeignKey
ALTER TABLE "USERS" DROP CONSTRAINT "USERS_location_id_fkey";

-- AlterTable
ALTER TABLE "USERS" ALTER COLUMN "location_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "USERS" ADD CONSTRAINT "USERS_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "LOCATIONS"("id") ON DELETE SET NULL ON UPDATE CASCADE;
