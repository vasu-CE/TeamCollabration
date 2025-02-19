import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import studentRoutes from "./routes/student.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import facultyRoutes from "./routes/faculty.routes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth" , authRoutes);
app.use("/users" , userRoutes);
app.use("/students" , studentRoutes);
app.use("/admin" , adminRoutes);
app.use("/faculty" , facultyRoutes);


const PORT = process.env.PORT || 3000

app.listen(PORT , () => {
    console.log(`http://localhost:${PORT}`);
})