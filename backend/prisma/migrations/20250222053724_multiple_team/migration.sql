/*
  Warnings:

  - You are about to drop the column `teamId` on the `Student` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_leaderId_fkey";

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "resetId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "teamId",
ADD COLUMN     "resetId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "leaderId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "StudentTeamHistory" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "resetId" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentTeamHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentTeamHistory_id_key" ON "StudentTeamHistory"("id");

-- CreateIndex
CREATE UNIQUE INDEX "StudentTeamHistory_studentId_teamId_resetId_key" ON "StudentTeamHistory"("studentId", "teamId", "resetId");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "StudentTeamHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentTeamHistory" ADD CONSTRAINT "StudentTeamHistory_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentTeamHistory" ADD CONSTRAINT "StudentTeamHistory_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
