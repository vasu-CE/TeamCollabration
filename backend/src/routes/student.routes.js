import express from "express"
import { addMember, createTeam } from "../controllers/student.controller.js";
import isAuthenticated from "../middlewares/Authentication.js";

const router = express.Router();

router.post('/create-team', isAuthenticated , createTeam);
router.get('/add-member' , isAuthenticated , addMember)
// router.post('/make-team' , );

export default router