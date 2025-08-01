/*
  Warnings:

  - You are about to drop the column `deliveryId` on the `Expense` table. All the data in the column will be lost.
  - Added the required column `employeeId` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Expense" DROP CONSTRAINT "Expense_deliveryId_fkey";

-- AlterTable
ALTER TABLE "public"."Expense" DROP COLUMN "deliveryId",
ADD COLUMN     "employeeId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Expense" ADD CONSTRAINT "Expense_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
