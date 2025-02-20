import express from "express"
<<<<<<< HEAD
import { acceptJoinRequest, createTeam, joinTeam, rejectJoinRequest, sendJoinRequest } from "../controllers/student.controller.js";
=======
import { addMember, createTeam } from "../controllers/student.controller.js";
>>>>>>> 395656b (Create team and add member)
import isAuthenticated from "../middlewares/Authentication.js";

const router = express.Router();

router.post('/create-team', isAuthenticated , createTeam);
<<<<<<< HEAD
// router.get('/add-member' , isAuthenticated , addMember)
router.get('/send-request' , isAuthenticated , sendJoinRequest);
router.get('/accept-request' , isAuthenticated , acceptJoinRequest);
router.get('/reject-request' , isAuthenticated , rejectJoinRequest);
router.get('/join-team' , isAuthenticated , joinTeam);
=======
router.get('/add-member' , isAuthenticated , addMember)
>>>>>>> 395656b (Create team and add member)
// router.post('/make-team' , );

export default router