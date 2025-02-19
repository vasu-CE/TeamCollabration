import express from "express"
import { getStudents } from "../controllers/student.controller.js";

const router = express.Router();

router.post('/get' , getStudents);

export default router