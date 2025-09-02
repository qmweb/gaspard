/*
  Warnings:

  - Added the required column `number` to the `Estimate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Estimate" ADD COLUMN     "number" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Invoice" ADD COLUMN     "number" TEXT NOT NULL;
