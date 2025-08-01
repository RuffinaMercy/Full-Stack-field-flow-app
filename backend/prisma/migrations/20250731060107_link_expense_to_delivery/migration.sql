/*
  Warnings:

  - You are about to drop the column `employeeId` on the `Expense` table. All the data in the column will be lost.
  - Added the required column `deliveryId` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Expense" DROP CONSTRAINT "Expense_employeeId_fkey";

-- AlterTable
ALTER TABLE "public"."Expense" DROP COLUMN "employeeId",
ADD COLUMN     "deliveryId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Expense" ADD CONSTRAINT "Expense_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "public"."Delivery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
