import express from "express"
import isAuthenticated from "../middlewares/Authentication.js"
import {isAdmin} from '../utils/helper.js'
import { addFaculty, addStudent } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/add-student" , isAuthenticated , isAdmin , addStudent);
router.post("/add-faculty" , isAuthenticated , isAdmin , addFaculty);
// router.post("/update-reset" , isAuthenticated , isAdmin , updateResetId);

export default router