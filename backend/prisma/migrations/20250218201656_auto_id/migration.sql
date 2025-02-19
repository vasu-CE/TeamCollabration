-- AlterTable
CREATE SEQUENCE admin_id_seq;
ALTER TABLE "Admin" ALTER COLUMN "id" SET DEFAULT nextval('admin_id_seq');
ALTER SEQUENCE admin_id_seq OWNED BY "Admin"."id";

-- AlterTable
CREATE SEQUENCE evaluation_id_seq;
ALTER TABLE "Evaluation" ALTER COLUMN "id" SET DEFAULT nextval('evaluation_id_seq');
ALTER SEQUENCE evaluation_id_seq OWNED BY "Evaluation"."id";

-- AlterTable
CREATE SEQUENCE faculty_id_seq;
ALTER TABLE "Faculty" ALTER COLUMN "id" SET DEFAULT nextval('faculty_id_seq');
ALTER SEQUENCE faculty_id_seq OWNED BY "Faculty"."id";

-- AlterTable
CREATE SEQUENCE mark_id_seq;
ALTER TABLE "Mark" ALTER COLUMN "id" SET DEFAULT nextval('mark_id_seq');
ALTER SEQUENCE mark_id_seq OWNED BY "Mark"."id";

-- AlterTable
CREATE SEQUENCE project_id_seq;
ALTER TABLE "Project" ALTER COLUMN "id" SET DEFAULT nextval('project_id_seq');
ALTER SEQUENCE project_id_seq OWNED BY "Project"."id";

-- AlterTable
CREATE SEQUENCE student_id_seq;
ALTER TABLE "Student" ALTER COLUMN "id" SET DEFAULT nextval('student_id_seq');
ALTER SEQUENCE student_id_seq OWNED BY "Student"."id";

-- AlterTable
CREATE SEQUENCE team_id_seq;
ALTER TABLE "Team" ALTER COLUMN "id" SET DEFAULT nextval('team_id_seq');
ALTER SEQUENCE team_id_seq OWNED BY "Team"."id";
