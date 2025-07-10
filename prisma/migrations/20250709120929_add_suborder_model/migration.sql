-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'IN_TRANSIT';

-- CreateTable
CREATE TABLE "SubOrder" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "sellerProfileId" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SubOrder_orderId_idx" ON "SubOrder"("orderId");

-- CreateIndex
CREATE INDEX "SubOrder_sellerProfileId_idx" ON "SubOrder"("sellerProfileId");

-- AddForeignKey
ALTER TABLE "SubOrder" ADD CONSTRAINT "SubOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubOrder" ADD CONSTRAINT "SubOrder_sellerProfileId_fkey" FOREIGN KEY ("sellerProfileId") REFERENCES "SellerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
