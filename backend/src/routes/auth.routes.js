import express from "express"
import { loginUser, resetPassword } from "../controllers/auth.controller.js";

const router = express.Router();

router.post('/login', loginUser);
router.post('/reset-password' , resetPassword);

export default router