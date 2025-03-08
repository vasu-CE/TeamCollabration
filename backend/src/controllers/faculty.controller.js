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

export const getStudents = async (req , res) => {
    try{
        const faculty = await prisma.faculty.findFirst({
            where : { id : req.user.id}
        })
        const students = await prisma.student.findMany({
            where : {
                institute : faculty.institute,
                department : faculty.department
            }
        })

        return res.status(200).status(200 , {} , students);
    }catch(err){
        return res.status(500).json(new ApiError(500 , err.message || "Internal Server error"));
    }
}

export const deleteStudents = async (req , res) => {
    try{
        const {studentId} = req.params;

        await prisma.student.delete({
            where : { id : studentId }
        })

        return res.status(500).json(new ApiError(500 , "Student deleted successfully"));
    }catch(err){
        return res.status(500).json(new ApiError(500 , err.message || "Internal Server error"))
    }
}

export const getTeams = async (req , res) => {
    try{
        console.log(req.user.id)
        const faculty = await prisma.faculty.findFirst({
            where : { userId : req.user.id}
        })
        const teams = await prisma.team.findMany({
            where : {
                institute : faculty.institute,
                department :faculty.department
            },
            include : {
                students : {
                    include : { user : true } 
                }
            }
        })

        return res.status(200).json(new ApiResponse(200 , teams));
    }catch(err){
        return res.status(500).json(new ApiError(500 , err.message || "Internal Server"));
    }
}

export const getTeamProject = async (req , res) => {
    try{
        const { teamId } = req.params;
        
        const team = await prisma.team.findUnique({
            where: { id: Number(teamId) },  
            include: {
                projects: true
            }
        });

        if (!team) {
            return res.status(404).json(new ApiError(404, "Team not found"));
        }

        return res.status(200).json(new ApiResponse(200 , team));
    }catch(err){
        return res.status(500).json(new ApiError(500, err.message || "Internal Server error"));
    }
}

export const getProject = async ( req , res) => {
    try{
        const {projectId} = req.params;

        const project = await prisma.project.findFirst({
            where : { id : projectId}
        })

        return res.status(200).json(new ApiResponse(200 , project));
    }catch(err){
        return res.status(500).json(new ApiError(500 , err.message))
    }
}