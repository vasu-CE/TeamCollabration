/*
  Warnings:

  - A unique constraint covering the columns `[teamId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "teamId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Student_teamId_key" ON "Student"("teamId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
