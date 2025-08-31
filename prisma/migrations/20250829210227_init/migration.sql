-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."Religion" AS ENUM ('ISLAM', 'CHRISTIANITY', 'HINDUISM', 'BUDDHISM', 'JUDAISM', 'ATHEISM', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."Education" AS ENUM ('NONE', 'PRIMARY', 'SECONDARY', 'HIGH_SCHOOL', 'BACHELORS', 'MASTERS', 'PHD', 'SELF_TAUGHT', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."Profession" AS ENUM ('STUDENT', 'ENGINEERING', 'SOFTWARE_DEVELOPMENT', 'DATA_SCIENCE', 'ARTIFICIAL_INTELLIGENCE', 'MEDICINE', 'DENTISTRY', 'NURSING', 'EDUCATION', 'BUSINESS', 'ENTREPRENEUR', 'FINANCE', 'MARKETING', 'SALES', 'LAW', 'GOVERNMENT', 'PUBLIC_SERVICE', 'DESIGN', 'WRITING', 'JOURNALISM', 'ARTS', 'FILM', 'MUSIC', 'SPORTS', 'AGRICULTURE', 'ARCHITECTURE', 'PSYCHOLOGY', 'SOCIAL_WORK', 'FREELANCER', 'UNEMPLOYED', 'HOMEMAKER', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."PurposeDomain" AS ENUM ('SOCIAL', 'ENVIRONMENTAL', 'TECHNOLOGICAL', 'EDUCATIONAL', 'RELIGIOUS', 'PERSONAL');

-- CreateEnum
CREATE TYPE "public"."PurposeArchetype" AS ENUM ('LEADER', 'CREATOR', 'HEALER', 'EXPLORER', 'ADVOCATE', 'VISIONARY');

-- CreateEnum
CREATE TYPE "public"."PurposeModality" AS ENUM ('INDIVIDUAL', 'COMMUNITY', 'GLOBAL');

-- CreateEnum
CREATE TYPE "public"."Interest" AS ENUM ('SPORTS', 'MUSIC', 'TRAVEL', 'READING', 'COOKING', 'ART', 'TECHNOLOGY', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."Personality" AS ENUM ('INTROVERT', 'EXTROVERT', 'AMBIVERT');

-- CreateEnum
CREATE TYPE "public"."MaritalStatus" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED');

-- CreateEnum
CREATE TYPE "public"."LookingFor" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED');

-- CreateEnum
CREATE TYPE "public"."Language" AS ENUM ('ENGLISH', 'URDU', 'ARABIC', 'HINDI', 'FRENCH', 'GERMAN', 'PUNJABI', 'TURKISH', 'PERSIAN', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."Smoke" AS ENUM ('YES', 'NO', 'OCCASIONALLY');

-- CreateEnum
CREATE TYPE "public"."Alcohol" AS ENUM ('YES', 'NO', 'OCCASIONALLY');

-- CreateEnum
CREATE TYPE "public"."Drugs" AS ENUM ('YES', 'NO', 'OCCASIONALLY');

-- CreateEnum
CREATE TYPE "public"."Politics" AS ENUM ('LEFT', 'RIGHT', 'CENTER', 'LIBERTARIAN', 'FUNDAMENTALIST', 'CONSERVATIVE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."PhotoStatus" AS ENUM ('ACTIVE', 'PENDING', 'DELETED');

-- CreateEnum
CREATE TYPE "public"."MatchStatus" AS ENUM ('PENDING', 'INTERESTED', 'MATCHED', 'REJECTED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "public"."Plan" AS ENUM ('FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELED', 'PAUSED');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('CARD', 'PAYPAL', 'STRIPE', 'BANK_TRANSFER');

-- CreateEnum
CREATE TYPE "public"."TransactionStatus" AS ENUM ('SUCCESS', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "dob" TIMESTAMP(3),
    "gender" "public"."Gender" NOT NULL,
    "income" INTEGER,
    "religion" "public"."Religion" NOT NULL,
    "education" "public"."Education" NOT NULL,
    "profession" "public"."Profession" NOT NULL,
    "lat" DOUBLE PRECISION,
    "lang" DOUBLE PRECISION,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "purposeDomain" "public"."PurposeDomain" NOT NULL,
    "purposeArchetype" "public"."PurposeArchetype" NOT NULL,
    "purposeModality" "public"."PurposeModality" NOT NULL,
    "purposeNarrative" TEXT,
    "interests" "public"."Interest"[],
    "personality" "public"."Personality" NOT NULL,
    "maritalStatus" "public"."MaritalStatus" NOT NULL,
    "lookingFor" "public"."LookingFor" NOT NULL,
    "language" "public"."Language" NOT NULL,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "smoke" "public"."Smoke" NOT NULL,
    "alcohol" "public"."Alcohol" NOT NULL,
    "drugs" "public"."Drugs" NOT NULL,
    "politics" "public"."Politics"[],
    "isNew" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Match" (
    "id" TEXT NOT NULL,
    "userAId" TEXT NOT NULL,
    "userBId" TEXT NOT NULL,
    "compatibilityScore" DOUBLE PRECISION NOT NULL,
    "status" "public"."MatchStatus" NOT NULL DEFAULT 'PENDING',
    "initiatedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" "public"."Plan" NOT NULL,
    "status" "public"."SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "paymentMethod" "public"."PaymentMethod" NOT NULL,
    "status" "public"."TransactionStatus" NOT NULL,
    "transactionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "public"."Profile"("userId");

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Match" ADD CONSTRAINT "Match_userAId_fkey" FOREIGN KEY ("userAId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Match" ADD CONSTRAINT "Match_userBId_fkey" FOREIGN KEY ("userBId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Match" ADD CONSTRAINT "Match_initiatedById_fkey" FOREIGN KEY ("initiatedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "public"."Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
