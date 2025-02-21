import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const prisma = new PrismaClient();

export const createTeam = async (req , res) => {
    try{
        const { name , members } = req.body;
        const leader = await prisma.student.findFirst({
            where : { userId : req.user.id }
        })

        const students = await prisma.student.findMany({
            where : {
                userId : { in : members.map(member => member.id) , mode : "insensitive"}
            }
        })

        const team = await prisma.team.create({
            data : {
                name ,
                leader : {
                    connect : { 
                        id : leader.id 
                    }
                },
                students : {
                    connect : students.map((student) => ({ id : student.id }))
                },
                studentsCount : students.length + 1
            }
        })

        await prisma.student.update({
            where : { id : leader.id},
            data : {
                teamId : team.id
            }
        })

        res.status(200).json(new ApiResponse(200 , "Team Created Successfully" ,team ));        
    }catch(err){
        res.status(500).json(new ApiError(500 , err.message || "Internal Server error"));
    }
}

export const addMember = async (req , res) => {
    const { id } = req.body;
    try{
        const leader = await prisma.student.findFirst({
            where : { userId : req.user.id }
        })

        if (!leader) {
            return res.status(404).json(new ApiError(404, "You can't add member"));
        }

        const team = await prisma.team.findFirst({
            where : {
                leaderId : leader.id 
            }
        })
        
        if(!team){
            return res.status(401).json(new ApiError(401 , "You can't add members"));
        }

        if(team.studentsCount >=4 ){
            return res.status(403).json(new ApiError(403 , "Team Size is FULL"));
        }

        const newStudent = await prisma.student.findFirst({
            where: { userId: id},
        });

        if (newStudent.teamId) {
            return res.status(400).json(new ApiError(400, "Student is already in a team"));
        }

        await prisma.team.update({
            where : { leaderId : leader.id},
            data : {
                students : {
                    connect : { id : newStudent.id}
                },
                studentsCount : {increment : 1}
            }
        })
        
        return res.status(200).json(new ApiResponse(200 , "Member added successfully"));
    }catch(err){
        return res.status(500).json(new ApiError(500 , err.message || "Internal Server error"));
    }
}