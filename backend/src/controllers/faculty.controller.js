import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import prisma from "../utils/prismClient.js";
import bcrypt from "bcrypt";


export const addStudent = async (req , res) => {
    try{
        const {studentId , name , email , current_study_year , passing_year , batch} = req.body;

        const existingUser = await prisma.user.findFirst({
            where : {
                OR : [ { email } , { id : studentId }]
            }
        });

        if(existingUser) {
            return res.status(400).json(new ApiError(400 , "Student already exist"));
        }

        const password = Math.random().toString(36).slice(-8);
        const hashPassword = await bcrypt.hash(password , 10)

        const user = await prisma.user.create({
            data : {
                id : studentId,
                name,
                email,
                password : hashPassword,
                department : req.user.department,
                institute : req.user.institute
            }
        });
        console.log(password)
        const student = await prisma.student.create({
            data : {
                user : {
                    connect : { id : user.id }
                },
                current_study_year,
                passing_year,
                batch
            }
        })

        res.status(200).json(new ApiResponse(200 , "Student added successfully" , student));
    }catch(err){
        res.status(500).json(new ApiError(500 , err.message || "Internal Server error"));
    }
}