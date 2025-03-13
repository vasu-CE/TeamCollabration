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
            where : { id : req.user.userId}
        })
        // console.log(faculty)
        const students = await prisma.student.findMany({
            where : {
                institute : faculty.institute,
                department : faculty.department
            }, include: {
                user: { select: { name: true, email: true } }, // Include student's name & email from the User model
            }
        })
    //  console.log(students)
        // return res.status(200).status(200 , students , students);
      return  res.status(200).json(new ApiResponse(200 , "Student fetch successfully" , students));

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

// export const getTeams = async (req , res) => {
//     try{
//         console.log(req.user.id)
//         const faculty = await prisma.faculty.findFirst({
//             where : { userId : req.user.id}
//         })
//         const teams = await prisma.team.findMany({
//             where : {
//                 institute : faculty.institute,
//                 department :faculty.department
//             },
//             include : {
//                 students : {
//                     include : { user : true } 
//                 }
//             }
//         })

//         return res.status(200).json(new ApiResponse(200 , teams));
//     }catch(err){
//         return res.status(500).json(new ApiError(500 , err.message || "Internal Server"));
//     }
// }

export const getTeams = async (req, res) => {
    try {
        const {batch,year} = req.query;
        // console.log(batch)
        // console.log(year)

        // Get faculty details
        const faculty = await prisma.faculty.findFirst({
            where: { userId: req.user.id }
        });

        if (!faculty) {
            return res.status(404).json(new ApiError(404, "Faculty not found"));
        }

        // Validate batch and year
        if (!batch || !year) {
            return res.status(400).json(new ApiError(400, "Batch and Year are required"));
        }

        // Convert year to integer for filtering
        // const numericYear = parseInt(year, 10);

        // Fetch teams based on batch and year
        const teams = await prisma.team.findMany({
            where: {
                institute: faculty.institute,
                department: faculty.department,
                students: {
                    some: {  // ✅ Check if any student in the team matches the criteria
                        batch: batch,
                        current_study_year: year // Ensure year is an integer
                    }
                }
            },
            include: {
                students: {
                    include: { user: true }
                }
            }
        });

        return res.status(200).json(new ApiResponse(200, "Teams fetched successfully", teams));
    } catch (err) {
        console.error("Error fetching teams:", err);
        return res.status(500).json(new ApiError(500, err.message || "Internal Server Error"));
    }
};





export const getTeamProject = async (req , res) => {
    try{
        const { teamId } = req.params;
        
        const team = await prisma.team.findUnique({
            where: { id: teamId },  
            include: {
                projects: true,
                students: true

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