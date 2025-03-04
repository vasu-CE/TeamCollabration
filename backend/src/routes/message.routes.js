import express from "express";
import { getUserSidebar, getMessages, sendMessage } from "../controllers/message.controller.js";
// import { isAuthenticated } from "../middlewares/auth.js"; // Ensure authentication middleware is included
import isAuthenticated from "../middlewares/Authentication.js";
const router = express.Router();

// Fetch team members for the sidebar
router.get("/team-members", isAuthenticated, getUserSidebar);

// Get messages between two team members
router.get("/:id", isAuthenticated, getMessages);

// Send a message to a team member
router.post("/send/:id", isAuthenticated, sendMessage);

export default router;
