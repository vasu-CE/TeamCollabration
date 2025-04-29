import express from "express"
import { loginUser, resetPassword ,forgotpasswor} from "../controllers/auth.controller.js";

const router = express.Router();

router.post('/login', loginUser);
router.post('/reset-password' , resetPassword);
router.post('/forgot-password' , forgotpasswor);
router.post('/logout', (req, res) => {
    res.clearCookie('auth_token', { httpOnly: true, secure: true });
    res.status(200).json({ message: 'Logged out successfully' });
  });

export default router