/*
  Warnings:

  - You are about to drop the column `project_id` on the `Team` table. All the data in the column will be lost.
  - Added the required column `teamId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_project_id_fkey";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "teamId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "project_id";

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
