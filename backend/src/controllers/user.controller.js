import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/ApiError.js';

const prisma = new PrismaClient();


export const getAllUsers = async (req , res) => {
    try{
        const users = prisma.user.findMany();
        res.json(users);
    }catch(err){
        console.log(err);
    }
}
