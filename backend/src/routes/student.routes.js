import express from "express"

import { acceptJoinRequest, createProject, createTeam, getTeams, getTeamWithProjects, joinTeam, rejectJoinRequest, sendJoinRequest } from "../controllers/student.controller.js";
import isAuthenticated from "../middlewares/Authentication.js";

const router = express.Router();

router.post('/create-team', isAuthenticated , createTeam);

router.get('/send-request/:studentId' , isAuthenticated , sendJoinRequest);
router.get('/accept-request/:requestId' , isAuthenticated , acceptJoinRequest);
router.get('/reject-request/:requestId' , isAuthenticated , rejectJoinRequest);
router.get('/join-team' , isAuthenticated , joinTeam);
router.post('/create-project' , isAuthenticated , createProject);
router.get('/get-team/:teamId' , isAuthenticated , getTeamWithProjects);

router.get('/get-teams', isAuthenticated , getTeams);

// router.get('/add-member' , isAuthenticated , addMember)

// router.post('/make-team' , );

export default router