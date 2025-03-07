import express from "express";
import isAuthenticated from "../middlewares/Authentication.js";
import { isFaculty } from "../utils/helper.js";
import { addStudent, getProject, getStudents, getTeamProject, getTeams } from "../controllers/faculty.controller.js";

const router = express.Router();

router.post('/add-student' , isAuthenticated , isFaculty , addStudent);
router.get('/get-students' , isAuthenticated , isFaculty , getStudents);
router.get('/get-teams' , isAuthenticated , isFaculty , getTeams);
router.get('/get-team/:teamId' , isAuthenticated , isFaculty , getTeamProject);
router.get('/get-project/:projectId' , isAuthenticated , isFaculty , getProject)
// router.get('/get-team/:id' , )

export default router;