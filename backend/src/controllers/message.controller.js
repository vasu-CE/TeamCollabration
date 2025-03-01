import prisma from "../utils/prismClient.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { io, getReceiverSocketId } from "../utils/socket.js";
// import cloudinary from "cloudinary";
// import bcrypt from "bcrypt"
// import jwt from "jsonwebtoken"



export const getUserSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;

        // Find the teams the logged-in user is part of
        const userTeams = await prisma.team.findMany({
            where: {
                students: {
                    some: {
                        studentId: loggedInUserId
                    }
                }
            },
            select: {
                id: true
            }
        });

        if (userTeams.length === 0) {
            return res.status(200).json(new ApiResponse(200, "No team members found", []));
        }

        const teamIds = userTeams.map(team => team.id);

        // Find users who are in the same teams
        const teamMembers = await prisma.user.findMany({
            where: {
                OR: [
                    { Student: { some: { team: { id: { in: teamIds } } } } },
                    { Faculty: { some: { team: { id: { in: teamIds } } } } }
                ],
                id: { not: loggedInUserId }
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });

        res.status(200).json(new ApiResponse(200, "Team members fetched successfully", teamMembers));
    } catch (error) {
        console.error("Error in getUserSidebar:", error.message);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
};



export const getMessages = async (req, res) => {
    try {
      const { id: userToChatId } = req.params;
      const myId = req.user.id;
  
      // Get teamId where both users exist
      const team = await prisma.team.findFirst({
        where: {
          students: {
            some: { studentId: myId },
          },
          AND: {
            students: {
              some: { studentId: userToChatId },
            },
          },
        },
      });
  
      if (!team) {
        return res.status(403).json(new ApiError(403, "You can only chat with team members"));
      }
  
      const messages = await prisma.message.findMany({
        where: {
          teamId: team.id,
          OR: [
            { senderId: myId, receiverId: userToChatId },
            { senderId: userToChatId, receiverId: myId },
          ],
        },
        orderBy: { createdAt: "asc" },
      });
  
      res.status(200).json(new ApiResponse(200, "Messages fetched successfully", messages));
    } catch (error) {
      console.error("Error in getMessages controller:", error.message);
      res.status(500).json(new ApiError(500, "Internal server error"));
    }
  };


  export const sendMessage = async (req, res) => {
    try {
      const { text } = req.body;
      const { id: receiverId } = req.params;
      const senderId = req.user.id;
  
      // Find the common team
      const team = await prisma.team.findFirst({
        where: {
          students: {
            some: { studentId: senderId },
          },
          AND: {
            students: {
              some: { studentId: receiverId },
            },
          },
        },
      });
  
      if (!team) {
        return res.status(403).json(new ApiError(403, "You can only message team members"));
      }
  
      const newMessage = await prisma.message.create({
        data: {
          senderId,
          receiverId,
          teamId: team.id, // Link message to team
          text,
        },
      });
  
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
  
      res.status(201).json(new ApiResponse(201, "Message sent successfully", newMessage));
    } catch (error) {
      console.error("Error in sendMessage controller:", error.message);
      res.status(500).json(new ApiError(500, "Internal server error"));
    }
  };
  