-- AlterTable
ALTER TABLE "User" ADD COLUMN     "loginType" TEXT,
ALTER COLUMN "profilePhoto" DROP NOT NULL;
