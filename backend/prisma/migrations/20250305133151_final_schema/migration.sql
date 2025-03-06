/*
  Warnings:

  - You are about to drop the column `resetId` on the `Admin` table. All the data in the column will be lost.
  - The `status` column on the `JoinRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `resetId` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the `StudentTeamHistory` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[teamId,semester]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JoinRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_teamId_fkey";

-- DropForeignKey
ALTER TABLE "StudentTeamHistory" DROP CONSTRAINT "StudentTeamHistory_studentId_fkey";

-- DropForeignKey
ALTER TABLE "StudentTeamHistory" DROP CONSTRAINT "StudentTeamHistory_teamId_fkey";

-- DropIndex
DROP INDEX "Student_teamId_key";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "resetId";

-- AlterTable
ALTER TABLE "JoinRequest" DROP COLUMN "status",
ADD COLUMN     "status" "JoinRequestStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isUnderSgp" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "semester" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "resetId",
DROP COLUMN "teamId";

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "StudentTeamHistory";

-- CreateTable
CREATE TABLE "_StudentToTeam" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_StudentToTeam_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_StudentToTeam_B_index" ON "_StudentToTeam"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Project_teamId_semester_key" ON "Project"("teamId", "semester");

-- AddForeignKey
ALTER TABLE "_StudentToTeam" ADD CONSTRAINT "_StudentToTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentToTeam" ADD CONSTRAINT "_StudentToTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
