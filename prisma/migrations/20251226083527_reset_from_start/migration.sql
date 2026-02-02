/*
  Warnings:

  - You are about to drop the column `comments` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `views` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `coinflips` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profileViews` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExtendedProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CategoryToPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExtendedProfile" DROP CONSTRAINT "ExtendedProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToPost" DROP CONSTRAINT "_CategoryToPost_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToPost" DROP CONSTRAINT "_CategoryToPost_B_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "comments",
DROP COLUMN "likes",
DROP COLUMN "views",
ADD COLUMN     "content" TEXT,
ALTER COLUMN "published" SET DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "coinflips",
DROP COLUMN "profileViews",
DROP COLUMN "role";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "ExtendedProfile";

-- DropTable
DROP TABLE "_CategoryToPost";

-- DropEnum
DROP TYPE "Role";
