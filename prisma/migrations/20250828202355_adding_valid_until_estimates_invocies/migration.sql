-- AlterTable
ALTER TABLE "public"."Estimate" ADD COLUMN     "validUntil" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."Invoice" ADD COLUMN     "validUntil" TIMESTAMP(3);
