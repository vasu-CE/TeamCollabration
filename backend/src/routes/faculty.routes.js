import express from "express";
import isAuthenticated from "../middlewares/Authentication.js";
import { isFaculty } from "../utils/helper.js";
import { addStudent } from "../controllers/faculty.controller.js";

const router = express.Router();

router.post('/add-student' , isAuthenticated , isFaculty , addStudent);

export default router;