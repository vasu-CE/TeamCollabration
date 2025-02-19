import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import studentRouts from "./routes/student.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth" , authRoutes);
app.use("/users" , userRoutes);
app.use("/students" , studentRouts);


const PORT = process.env.PORT || 3000

app.listen(PORT , () => {
    console.log(`http://localhost:${PORT}`);
})