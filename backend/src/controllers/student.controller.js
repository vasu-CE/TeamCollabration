import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const prisma = new PrismaClient();

export const createTeam = async (req , res) => {
    const teamCode = Math.random().toString(36).slice(-6)

    try{
        const { name } = req.body;
        const leader = await prisma.student.findFirst({
            where : { userId : req.user.id }
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
                    connect : { id : leader.id}
                },
                studentsCount : 1
            }
        })
        
        return res.status(200).json(new ApiResponse(200 , "Team Created Successfully" ,team ));        
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
        const leader = await prisma.student.findFirst({ 
            where: { userId: req.user.id }
        });

        if (!leader) {
            return res.status(403).json(new ApiError(403, "You are not a team leader"));
        }

        const team = await prisma.team.findFirst({
            where: { leaderId: leader.id }
        });

        if (!team) {
            return res.status(403).json(new ApiError(403, "You do not have a team"));
        }

        const student = await prisma.student.findFirst({ where: { userId: studentId } });

        if (!student) {
            return res.status(404).json(new ApiError(404, "Student not found"));
        }
        
        const existingRequest = await prisma.joinRequest.findFirst({
            where: {
                teamId: team.id,
                studentId: student.id
            }
        });
        
        if (existingRequest) {
            return res.status(400).json(new ApiError(400, "Join request already sent"));
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
        // console.log(req.user.id)
        const student = await prisma.student.findUnique({
            where : { userId : req.user.id }
        })

        if(request.studentId !== student.id){
            return res.status(403).json(new ApiError(403, "You do not have permission"));
        }

        const team = await prisma.team.findUnique({
            where : { id : request.teamId }
        })

        if (team.studentsCount >= 4) {
            return res.status(400).json(new ApiError(400, "Team is full"));
        }

        // const student = await prisma.student.findUnique({ where: { id: request.studentId } });

        await prisma.$transaction([
            prisma.team.update({
                where: { id: request.teamId },
                data: {
                    students : {
                        connect : { id : student.id}
                    },
                    studentsCount: { increment: 1 }
                }
            }),
            prisma.joinRequest.delete({ where: { id: requestId } })
        ]);

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
export const joinTeam = async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: "Unauthorized: Session expired" });
    }

    const { teamCode } = req.body;

    try {
        const team = await prisma.team.findFirst({ where: { teamCode } });

        if (!team) {
            return res.status(404).json({ success: false, message: "Wrong team code" });
        }

        if (team.studentsCount >= 4) {
            return res.status(403).json({ success: false, message: "Team size is FULL" });
        }

        const student = await prisma.student.findFirst({ where: { userId: req.user.id } });

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        // DEBUG LOG
        // console.log("Checking for existing membership:", { studentId: student.id, resetId: student.resetId });

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


        return res.status(200).json({ success: true, message: "Joined the team successfully" });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
    }
};


// export const createProject = async (req , res) => {
//    try{
//     const { title, description, technology , gitHubLink, isUnderSgp, semester } = req.body;

//     if(!title || !description || !technology){
//         return res.status(404).json(new ApiError(404 , "Info is missing"));
//     }
    
//     const leader = await prisma.student.findFirst({
//         where : { userId : req.user.id}
//     })

//     const team = await prisma.team.findFirst({
//         where : { leaderId : leader.id }
//     })

//     if(!team){
//         return res.status(404).json(new ApiError(404 , "You can't create a project"));
//     }

//     if (isUnderSgp && !semester) {
//         return res.status(400).json({ error: "SGP projects require a semester value." });
//     }

//     const project = await prisma.project.create({
//         data : {
//             title,
//             description,
//             technology,
//             status : "IN_PROGRESS",
//             gitHubLink : gitHubLink.trim(),
//             team : {
//                 connect : {
//                     id : team.id
//                 }
//             },
//             isUnderSgp,
//             semester : isUnderSgp ? semester : null
//         }
//     })

//     return res.status(200).json(new ApiError(200 , "Project created successfully" , project))
//    }catch(err){
//         return res.status(500).json(new ApiError(500, err.message || "Internal Server Error"));
//    }
// }

export const createProject = async (req, res) => {
    try {
        // console.log(req.body)
      const { title, description, technology, gitHubLink, isUnderSgp, semester } = req.body;
      const {teamId} = req.params
      // Ensure all required fields are provided
      if (!title || !description || !technology) {
        // console.log(title);
        return res.status(400).json(new ApiError(400, "Required information is missing"));
      }
  
      // Fetch the team leader based on the user ID
      const leader = await prisma.student.findFirst({
        where: { userId: req.user.id }
      });
  
      // Find the team led by the current user
      const team = await prisma.team.findFirst({
        where: { leaderId: leader.id }
      });
  
      // If no team is found, prevent project creation
      if (!team) {
        return res.status(404).json(new ApiError(404, "You can't create a project without a team"));
      }
  
      // Validate the semester value for SGP projects
      if (isUnderSgp && !semester) {
        return res.status(400).json({ error: "SGP projects require a semester value." });
      }
      console.log(team)
      // Create the project
      const project = await prisma.project.create({
        data: {
          title,
          description,
          technology,
          status: "IN_PROGRESS", // Initial status
          gitHubLink: gitHubLink ? gitHubLink.trim() : null, // Trim and ensure not null
          team: {
            connect: { id: teamId }
          },
          isUnderSgp,
          semester: isUnderSgp ? semester : null // Only assign semester if SGP
        }
      });
  
      // Respond with success
      return res.status(200).json(new ApiError(200, "Project created successfully", project));
    } catch (err) {
      // Handle server error
      return res.status(500).json(new ApiError(500, err.message || "Internal Server Error"));
    }
  };
  

  export const getRequest = async (req, res) => {
    try {
        const authorId = req.user?.id;
        if (!authorId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const author = await prisma.student.findFirst({
            where: { userId: authorId },
        });

        if (!author) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        const requests = await prisma.joinRequest.findMany({
            where: { studentId: author.id },
            include: {
                team: { select: { id: true, name: true } }, // Include team details
            },
        });

        return res.status(200).json({ 
            success: true, 
            message: "Requests retrieved", 
            data: requests.map(request => ({
                id: request.id,
                teamId: request.teamId,
                teamName: request.team?.name || "Unknown Team",  // Add team name
                status: request.status,
                createdAt: request.createdAt
            }))
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
    }
};



export const getTeamWithProjects = async (req, res) => {
    try {
        const { teamId } = req.params;  
      

        const team = await prisma.team.findUnique({
            where: { id: teamId },  
            include: {
                projects: true,
                students: {      // Fetch students associated with the team
                    include: {
                        user: true, // Include user details (if user entity exists)
                    },}
            }
           
        });
       
        if (!team) {
            return res.status(404).json(new ApiError(404, "Team not found"));
        }

        return res.status(200).json(new ApiResponse(200 , team));

    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message || "Internal Server Error"));
    }
};

export const getTeams = async (req , res) => {
    // console.log(req.user.id)
    try{
        const teams = await prisma.team.findMany({
            where : {
                students : {
                    some : {
                        userId : req.user.id
                    }
                },
            },
            include :{
                students : {
                    include : { user : true}
                }
            }
        }) 
        // console.log(teams)

        return res.status(200).json(new ApiResponse(200 , {} , teams))
    }catch(err){
        return res.status(500).json(new ApiError(500 , err.message))
    }
}

export const getProjects = async (req , res) => {
    try{
        const { projectId } = req.params;
        const projects = await prisma.project.findMany({
            projectId
        })

        return res.status(200).json(new ApiResponse(200 , {}, projects))

    }catch(err){
        return res.status(500).json(new ApiError(500 , err.message || "Internal Server Error"))
    }
}

export const leaderIdToUserId = async (req, res) => {
    try {
        const { leaderId } = req.params;

        const leader = await prisma.student.findUnique({
            where: { id: leaderId },
            select: { userId: true }
        });

        if (!leader) {
            return res.status(404).json(new ApiError(404, "Leader not found"));
        }

        return res.status(200).json(new ApiResponse(200, "User ID fetched successfully", leader));
    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message || "Internal Server Error"));
    }
};

export const removeStudent = async (req, res) => {
    const { studentId } = req.params;

    try {
        // Find the leader based on the logged-in user
        const leader = await prisma.student.findFirst({
            where: { userId: req.user.id }
        });

        if (!leader) {
            return res.status(403).json(new ApiError(403, "You are not authorized"));
        }

        // Find the team led by the leader
        const team = await prisma.team.findFirst({
            where: { leaderId: leader.id },
            include: { students: true }
        });

        if (!team) {
            return res.status(404).json(new ApiError(404, "You do not have a team"));
        }

        // Prevent leader from removing themselves
        if (team.leaderId === studentId) {
            return res.status(403).json(new ApiError(403, "Leader cannot remove themselves"));
        }

        // Check if the student exists
        const student = await prisma.student.findUnique({
            where: { id: studentId }
        });

        if (!student) {
            return res.status(404).json(new ApiError(404, "Student not found"));
        }

        // Ensure the student is a member of the team
        const isMember = team.students.some(s => s.id === student.id);
        if (!isMember) {
            return res.status(400).json(new ApiError(400, "Student is not part of the team"));
        }

        // Remove the student and decrement the studentsCount
        await prisma.team.update({
            where: { id: team.id },
            data: {
                students: {
                    disconnect: { id: student.id } // Remove student from the many-to-many relation
                },
                studentsCount: {
                    decrement: 1 // Ensure the studentsCount is decremented
                }
            }
        });

        return res.status(200).json(new ApiResponse(200, "Student removed successfully"));
    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message || "Internal Server Error"));
    }
};

