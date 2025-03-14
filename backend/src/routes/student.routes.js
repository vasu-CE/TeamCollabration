import express from "express"

import {removeStudent,leaderIdToUserId, acceptJoinRequest,getProjects ,createProject, createTeam, getRequest, getTeams, getTeamWithProjects, joinTeam, rejectJoinRequest, sendJoinRequest } from "../controllers/student.controller.js";
import isAuthenticated from "../middlewares/Authentication.js";

const router = express.Router();

router.post('/create-team', isAuthenticated , createTeam);

router.get('/send-request/:studentId' , isAuthenticated , sendJoinRequest);
router.get('/accept-request/:requestId' , isAuthenticated , acceptJoinRequest);
router.get('/reject-request/:requestId' , isAuthenticated , rejectJoinRequest);
router.post('/join-team' , isAuthenticated , joinTeam);
router.post('/create-project/:teamId' , isAuthenticated , createProject);

router.get('/get-requests' , isAuthenticated , getRequest);

router.get('/get-teams', isAuthenticated , getTeams);
router.get('/get-team/:teamId' , isAuthenticated , getTeamWithProjects);
router.get('/get-project/:projectId' , isAuthenticated , getProjects)
router.get('/get-leaderIdToUserId/:leaderId',isAuthenticated,leaderIdToUserId)
router.get('/student-remove/:studentId' , isAuthenticated ,removeStudent )


// router.get('/add-member' , isAuthenticated , addMember)

// router.post('/make-team' , );

export default router