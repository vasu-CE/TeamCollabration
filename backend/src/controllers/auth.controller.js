import { json } from "stream/consumers";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import prisma from "../utils/prismClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendMail } from "../mail/mailer.js";


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
        // console.log("Entered Password:", password);
        // console.log("Stored Password Hash:", user.password);
        
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
            secure: true,
            sameSite:"None",
        });

        // Send success response
        res.status(200).json(new ApiResponse(200, "Login Successful", user));
    } catch (err) {
        console.error("Login Error:", err);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
};

export const resetPassword = async (req , res) => {
    try {
        const { identifier, oldPassword, newPassword } = req.body;
        const user = await prisma.user.findFirst({
            where: { email : identifier }
        });

        if(!user){
            return res.status(404).json(new ApiError(404 , "User not found"));
        }

        const match = bcrypt.compare(oldPassword , user.password );
        if(!match){
            return res.status(401).json(new ApiError(401 , "Invalid old password"));
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { email: identifier },
            data: { password: hashedPassword },
        });
        return res.status(200).json(new ApiResponse(200 , "Password reset successfully"));
    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message || "Internal Server Error"));
    }
}

export const forgotpasswor=async(req ,res)=>{
    try {
        const { identifier } = req.body;
        const user = await prisma.user.findFirst({
            where: { email : identifier }
        });
        // console.log(user);
        if(!user){
            return res.status(404).json(new ApiError(404 , "User not found"));
        }

         const password = Math.random().toString(36).slice(-8);
        const hashPassword =await bcrypt.hash(password , 10);
                // console.log(password);
            
            const updatepass= await prisma.user.update({
                    where: { email: identifier },
                    data: { password: hashPassword },
                });
            // console.log(updatepass)
        await sendMail(identifier , "Your updated  credential for TAPMS" , password);
        return res.status(200).json(new ApiResponse(200 , "Please Check your mail Updated Password Sent Succesfully"));
        
    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message || "Internal Server Error"));        
    }

}



