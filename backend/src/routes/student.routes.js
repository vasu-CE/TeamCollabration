import express from "express"

import { acceptJoinRequest, createTeam, joinTeam, rejectJoinRequest, sendJoinRequest } from "../controllers/student.controller.js";
import isAuthenticated from "../middlewares/Authentication.js";

const router = express.Router();

router.post('/create-team', isAuthenticated , createTeam);

router.get('/send-request' , isAuthenticated , sendJoinRequest);
router.get('/accept-request' , isAuthenticated , acceptJoinRequest);
router.get('/reject-request' , isAuthenticated , rejectJoinRequest);
router.get('/join-team' , isAuthenticated , joinTeam);

router.get('/add-member' , isAuthenticated , addMember)

// router.post('/make-team' , );

export default router