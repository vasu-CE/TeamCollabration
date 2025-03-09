import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import prisma from "../utils/prismClient.js";

export const creatMark = async (req , res) => {
    try{
        const { internal1 , studentId} = req.body;
        if(!internal1){
            return res.status(404).json(new ApiError(404 , "Marks is required"));
        }

        const mark = await prisma.mark.create({
            data : {
                studentId,
                internal1
            }
        })

        return res.status(200).json(new ApiResponse(200 , "Marks added successfully" , mark));
    }catch(err){
        return res.status(500).json(new ApiError(500 , err.message));
    }
}

export const updateMark = async (req ,res) => {
    try {
        const {id} = req.params;
        const {internal1 , internal2 , external} = req.body;

        const existingMark = await prisma.mark.findFirst({
            where : {id : parseInt(id)}
        })

        if(!existingMark){
            return res.status(404).json(new ApiError(404 , "Marks not found"))
        }

        let updated = {};
        if (internal1 !== undefined) {
            return res.status(400).json(new ApiError(404 ,"internal1 cannot be updated again" ));
        }
      
        if (internal2 !== undefined) {
          if (!existingMark.internal1) {
            return res.status(400).json(new ApiError(404 ,"internal1 must be added before internal2" ));
          }
          updated.internal2 = internal2;
        }
    
        if (external !== undefined) {
          if (!existingMark.internal2) {
            return res.status(400).json(new ApiError(404 , "internal2 must be added before external" ));
          }
          updated.external = external;
        }
    
        if (Object.keys(updated).length === 0) {
          return res.status(400).json(new ApiError(404 , "No valid updates provided" ));
        }
    
        const updatedMark = await prisma.mark.update({
          where: { id: parseInt(id) },
          data: updated,
        });

        return res.status(200).json(new ApiResponse(200 , updatedMark));
    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message || "Internal Server Error"));
    }
}