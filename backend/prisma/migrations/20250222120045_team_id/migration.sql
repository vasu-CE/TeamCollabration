/*
  Warnings:

  - The primary key for the `Team` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "JoinRequest" DROP CONSTRAINT "JoinRequest_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_teamId_fkey";

-- DropForeignKey
ALTER TABLE "StudentTeamHistory" DROP CONSTRAINT "StudentTeamHistory_teamId_fkey";

-- AlterTable
ALTER TABLE "JoinRequest" ALTER COLUMN "teamId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "teamId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "StudentTeamHistory" ALTER COLUMN "teamId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Team" DROP CONSTRAINT "Team_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Team_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "team_id_seq";

-- AddForeignKey
ALTER TABLE "StudentTeamHistory" ADD CONSTRAINT "StudentTeamHistory_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoinRequest" ADD CONSTRAINT "JoinRequest_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
