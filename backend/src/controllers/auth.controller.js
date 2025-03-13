import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import prisma from "../utils/prismClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        // Validate input
        if (!identifier || !password) {
            return res.status(400).json(new ApiError(400, "Identifier and password are required"));
        }

        // Find user by email or ID
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ email: identifier }, { id: identifier }]
            }
        });

        // If user not found
        if (!user) {
            return res.status(404).json(new ApiError(404, "User not found"));
        }

        // Ensure user has a password stored
        if (!user.password) {
            return res.status(500).json(new ApiError(500, "User has no password set"));
        }

        // Debugging logs
        console.log("Entered Password:", password);
        console.log("Stored Password Hash:", user.password);

        // Compare password with stored hash
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json(new ApiError(401, "Invalid Credentials"));
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET
        );

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });

        // Send success response
        res.status(200).json(new ApiResponse(200, "Login Successful", user));
    } catch (err) {
        console.error("Login Error:", err);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
};
