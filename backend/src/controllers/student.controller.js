import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const prisma = new PrismaClient();

export const createTeam = async (req , res) => {
    const teamCode = Math.random().toString(36).slice(-6)

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
                teamCode : teamCode,
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

// export const addMember = async (req , res) => {
//     const { id } = req.body;
//     try{
//         const leader = await prisma.student.findFirst({
//             where : { userId : req.user.id }
//         })

//         if (!leader) {
//             return res.status(404).json(new ApiError(404, "You can't add member"));
//         }

//         const team = await prisma.team.findFirst({
//             where : {
//                 leaderId : leader.id 
//             }
//         })
        
//         if(!team){
//             return res.status(401).json(new ApiError(401 , "You can't add members"));
//         }

//         if(team.studentsCount >=4 ){
//             return res.status(403).json(new ApiError(403 , "Team Size is FULL"));
//         }

//         const newStudent = await prisma.student.findFirst({
//             where: { userId: id},
//         });

//         if (newStudent.teamId) {
//             return res.status(400).json(new ApiError(400, "Student is already in a team"));
//         }

//         await prisma.team.update({
//             where : { leaderId : leader.id},
//             data : {
//                 students : {
//                     connect : { id : newStudent.id}
//                 },
//                 studentsCount : {increment : 1}
//             }
//         })
        
//         return res.status(200).json(new ApiResponse(200 , "Member added successfully"));
//     }catch(err){
//         return res.status(500).json(new ApiError(500 , err.message || "Internal Server error"));
//     }
// }

export const sendJoinRequest = async (req, res) => {
    const { studentId } = req.params;
    try {
        const leader = await prisma.student.findFirst({ where: { userId: req.user.id } });
        const team = await prisma.team.findFirst({ where: { leaderId: leader.id } });

        if (!team) {
            return res.status(403).json(new ApiError(403, "You are not a team leader"));
        }

        const student = await prisma.student.findFirst({ where: { userId: studentId } });

        if (!student) {
            return res.status(404).json(new ApiError(404, "Student not found"));
        }

        if (student.teamId) {
            return res.status(400).json(new ApiError(400, "Student is already in a team"));
        }

        await prisma.joinRequest.create({
            data: {
                teamId: team.id,
                studentId: student.id,
            }
        });

        return res.status(200).json(new ApiResponse(200, "Join request sent"));
    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message || "Internal Server Error"));
    }
};

export const acceptJoinRequest = async (req, res) => {
    const { requestId } = req.params;
    try {
        const request = await prisma.joinRequest.findUnique({ where: { id: requestId } });

        if (!request) {
            return res.status(404).json(new ApiError(404, "Join request not found"));
        }

        const team = await prisma.team.findUnique({
            where : { id : request.teamId }
        })

        if (team.studentsCount >= 4) {
            return res.status(400).json(new ApiError(400, "Team is full"));
        }

        await prisma.team.update({
            where : { id : request.teamId },
            data : {
                students : {
                    connect : {
                        id : request.studentId
                    }
                },
                studentsCount : { increment : 1 }
            }
        })

        await prisma.joinRequest.delete({ where: { id: requestId } });

        return res.status(200).json(new ApiResponse(200, "Join request accepted"));
    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message || "Internal Server Error"));
    }
};

export const rejectJoinRequest = async (req , res) => {
    const {requestId} = req.params;
    try{
        const request = await prisma.joinRequest.findUnique({
            where : { id : requestId }
        })

        if (!request) {
            return res.status(404).json(new ApiError(404, "Join request not found"));
        }

        const team = await prisma.team.findUnique({
            where : { id : request.teamId }
        })

        if(!team) {
            return res.status(404).json(new ApiError(404 , "Team is not found"));
        }

        await prisma.joinRequest.delete({ where: { id: requestId } });

        return res.status(200).json(new ApiResponse(200, "Join request rejected"));
    }catch(err){
        return res.status(500).json(new ApiError(500 , err.message || "Internal Server error"));
    }
}

export const joinTeam = async (req , res) => {
    const { teamCode } = req.body;

    try{
        const team = await prisma.team.findFirst({
            where : { teamCode }
        })

        if(!team){
            return res.status(404).json(new ApiError(404 , "Wrong team Code"));
        }

        if(team.teamCount >= 4){
            return res.status(403).json(new ApiError(403 , "Team size is FULL"));
        }

        const student = await prisma.student.findFirst({
            where : { userId : req.user.id }
        })

        await prisma.team.update({
            where : { id : team.id },
            data : {
                students : {
                    connect : {
                        id : student.id
                    },  
                },
                studentsCount : {increment : 1}
            }
        })

        return res.status(200).json(new ApiResponse(200 , "Joined the team"));
        
    }catch(err){
        return res.status(500).json(new ApiError(500 , err.message || "Internal Server error"));
    }
}

export const createProject = async (req , res) => {
   try{
    const { projectName , description , technology } = req.body;

    if(!projectName || !description || !technology){
        return res.status(404).json(new ApiError(404 , "Info is missing"));
    }

    const leader = await prisma.student.findFirst({
        where : { userId : req.user.id}
    })

    const team = await prisma.team.findFirst({
        where : { leaderId : leader.id }
    })

    if(!team){
        return res.status(404).json(new ApiError(404 , "Team is not found"));
    }

    const project = await prisma.project.create({
        data : {
            title : projectName,
            description,
            technology,
            status : "IN_PROGRESS",
            team : {
                connect : {
                    id : team.id
                }
            }
        }
    })

    return res.status(200).json(new ApiError(200 , "Project created successfully" , project))
   }catch(err){
        return res.status(500).json(new ApiError(500, err.message || "Internal Server Error"));
   }
}

export const getTeamWithProjects = async (req, res) => {
    try {
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

        return res.status(200).json({ success: true, team });

    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message || "Internal Server Error"));
    }
};