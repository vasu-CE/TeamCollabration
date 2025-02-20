import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const prisma = new PrismaClient();

export const getStudents = async (req , res) => {
    try{
        const students = prisma.student.findMany();
        res.json(students);
    }catch(err){
        console.log(err);
    }
}
