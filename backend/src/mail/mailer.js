import nodemailer from "nodemailer"
import dotenv from "dotenv";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

dotenv.config();

const transporter = nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : process.env.EMAIL,
        pass : process.env.EMAIL_PASSWORD
    },
});

export const sendMail = async (to , subject , text) => {
    try {
        const mailOptions = {
            from : process.env.EMAIL,
            to,
            subject,
            text
        };

        await transporter.sendMail(mailOptions);
        // console.log("mailmsend succes fully");
        return new ApiResponse(200 , "Password sent successfully");

    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message || "Internal Server Error"));
    }
}