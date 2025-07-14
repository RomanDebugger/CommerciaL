/*
  Warnings:

  - The `gender` column on the `BuyerProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "BuyerProfile" DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender";
