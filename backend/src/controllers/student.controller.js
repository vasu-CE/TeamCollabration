import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getStudents = async (req , res) => {
    try{
        const students = prisma.student.findMany();
        res.json(students);
    }catch(err){
        console.log(err);
    }
}

export const addStudent = async (req , res) => {
    const { email, name, password, department, institute, current_study_year, passing_year, batch } = req.body;

    try{
        const user = prisma.user.create({
            data : {
                email,
                name,
                password,
                department,
                institute
            }
        });
    
        const student = prisma.student.create({
            data : {
                userId : user.id,
                current_study_year,
                passing_year,
                batch
            }
        });
    
        res.status(201).json({ message: "Student added successfully", student });
    }catch(err){
        res.status(500).json({ error: "An error occurred while adding the student", details: error.message });
    }
}