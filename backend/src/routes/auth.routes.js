import express from "express"
import { loginUser, resetPassword ,forgotpasswor} from "../controllers/auth.controller.js";

const router = express.Router();

router.post('/login', loginUser);
router.post('/reset-password' , resetPassword);
router.post('/forgot-password' , forgotpasswor);

export default router