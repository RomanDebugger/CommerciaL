-- AlterTable
ALTER TABLE "BuyerProfile" ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "phoneNumber" TEXT;

-- AlterTable
ALTER TABLE "SellerProfile" ADD COLUMN     "address" TEXT,
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "joinedAt" TIMESTAMP(3),
ADD COLUMN     "pincode" TEXT,
ADD COLUMN     "rating" DOUBLE PRECISION;
