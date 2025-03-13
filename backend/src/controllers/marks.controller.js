import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import prisma from "../utils/prismClient.js";


export const creatMark = async (req, res) => {
  try {
    console.log("Received data:", req.body); // Debugging

    const { studentId, internal1 } = req.body;
    // console.log(studentId, internal1)

    if (!internal1) {
      return res.status(400).json(new ApiError(400, "Marks are required"));
    }

    const existingMark = await prisma.mark.findFirst({
      where: { studentId: String(studentId) }
    });
    
    const isMarkPresent = !!existingMark; // Converts object presence to true/false
    
    console.log(isMarkPresent); // true if data exists, false otherwise
    
    

    let mark;

    if (isMarkPresent) {
      // Update existing mark
      mark = await prisma.mark.updateMany({
        where: { studentId: String(studentId) },
        data: {
          internal1: parseInt(internal1, 10)
        }
      });
    } else {
      // Create new mark
      mark = await prisma.mark.create({
        data: {
          studentId,
          internal1: parseInt(internal1, 10)
        }
      });
    }

    return res.status(200).json(new ApiResponse(200, "Marks updated successfully", mark));
  } catch (err) {
    return res.status(500).json(new ApiError(500, err.message));
  }
};


export const getMarks = async (req, res) => {
  try {
    const { year, batch } = req.query;

    console.log("Received Year & Batch:", year, batch);

    if (!year || !batch) {
      return res.status(400).json(new ApiError(400, "Year and batch are required"));
    }

    const faculty = await prisma.faculty.findFirst({
      where: { userId: req.user.id },
      include: { user: true }, // Fetch user details
    });

    if (!faculty) {
      return res.status(404).json(new ApiError(404, "Faculty not found"));
    }

    // Fetch marks for students in the given year and batch
    const marks = await prisma.mark.findMany({
      where: {
        student: {
          current_study_year: year,
          batch: batch,
          user: {
            department: faculty.user.department, // Ensure faculty can only access their department's students
            institute: faculty.user.institute,   // Ensure faculty can only access their institute's students
          },
        },
      },
      include: {
        student: {
          include: { user: true }, // Fetch student's user details
        },
      },
    });

    console.log("Marks Found:", marks);

    if (!marks.length) {
      return res.status(404).json(new ApiResponse(404, "No marks found for the given filters"));
    }

    return res.status(200).json(new ApiResponse(200, "Marks retrieved successfully", marks));
  } catch (err) {
    console.error("Error fetching marks:", err);
    return res.status(500).json(new ApiError(500, err.message));
  }
};

