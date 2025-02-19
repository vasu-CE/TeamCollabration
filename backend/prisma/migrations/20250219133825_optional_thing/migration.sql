-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_project_id_fkey";

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "teamId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "project_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
