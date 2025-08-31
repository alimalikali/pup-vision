-- AlterTable
ALTER TABLE "public"."Profile" ADD COLUMN     "admiredBy" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "admiredUsers" TEXT[] DEFAULT ARRAY[]::TEXT[];
