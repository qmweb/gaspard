/*
  Warnings:

  - Added the required column `name` to the `EstimateItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `InvoiceItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."EstimateItem" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."InvoiceItem" ADD COLUMN     "name" TEXT NOT NULL;
