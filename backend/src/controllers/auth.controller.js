import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import prisma from "../utils/prismClient.js";

export const loginUser = async (req , res) => {
    try{
        const { identifier , password } = req.body;

        let user;
        if(identifier.includes('@')){
            user = await prisma.user.findUnique({
                where : {
                    email : identifier
                }
            })
        }else{
            const student = await prisma.student.findUnique({
                where : { id : identifier },
                include : {user : true}
            })

            if(student) user = student.user
        }

        if(!user){
            return res.status(404).json(ApiError(404 , "User not found"));
        }

        const validPassword = await bcrypt.compare(password , user.password)
        if(!validPassword){
            return res.status(401).json(ApiError(401 , "Invalid Credentials"));
        }

        let role = user.role;

        const token = jwt.sign(
            {userId : user.id , role},
            process.env.JWT_SECRET,
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });

        res.status(200).json(ApiResponse(200 , {} , "Login Successfull"))
    }catch(err){
        return res.status(500).json(ApiError(500 , "internal Server Error"));
    }
}