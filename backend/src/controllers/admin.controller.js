import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import prisma from "../utils/prismClient.js";
import bcrypt from "bcrypt";

export const addStudent = async (req , res) => {
    const {studentId , email, name, department , current_study_year, passing_year, batch} = req.body;

    try{
        const existingUser =await prisma.user.findFirst({
            where : {
                OR : [{ email } , {id : studentId}]
            }
        })
        if(existingUser){
            return res.status(400).json(new ApiError(400 , "Student already exist"));
        }
        const password = Math.random().toString(36).slice(-8);
        const hashPassword =await bcrypt.hash(password , 10);
        console.log(password);
        const user = await prisma.user.create({
            data : {
                id : studentId,
                email,
                name,
                password : hashPassword,
                institute : req.user.institute,
                department
            }
        });

        const student = await prisma.student.create({
            data : {
                user : {
                    connect : {
                        id : user.id
                    }
                },
                current_study_year,
                passing_year,
                batch
            }
        });
    
        res.status(201).json(new ApiResponse(201, "Student added successfully", student ));
    }catch(err){
        console.log(err);
        res.status(500).json(new ApiError(500,err.message || "An error occurred while adding the student"));
    }
}

export const addFaculty = async (req , res) => {
    try{
        const {email , name , department} = req.body;
        const existingUser = await prisma.user.findFirst({
            where : {email}
        })
        if(existingUser){
            return res.status(400).json(new ApiError(400 , "User already exist"));
        }
        const password = Math.random().toString(36).slice(-8);
        const hashPassword = await bcrypt.hash(password , 10)
        const user = await prisma.user.create({
            data:{
                name,
                email,
                password : hashPassword,
                role : "FACULTY",
                institute : req.user.institute,
                department
            }
        });
        console.log(password);
        const faculty = await prisma.faculty.create({
            data : {
                user : {
                    connect : { id : user.id }
                },
            }
        });

        res.status(201).json(new ApiResponse(201 , "Faculty Created Successfully" , faculty));
    }catch(err){
        res.status(500).json(new ApiError(500 , err.message || "Internal Server Error"));
    }
}

// export const updateResetId = async (req , res) => {
//     try{
//         await prisma.student.updateMany({
//             where : {
//                 institute : req.user.institute
//             },
//             data : {
//                 resetId : { increment : 1 }
//             }
//         })
//     }catch(err){
//         return res.status(500).json(new ApiError(500 , err.message || "Internal Server error"));
//     }
// }