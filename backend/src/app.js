import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import studentRoutes from "./routes/student.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import facultyRoutes from "./routes/faculty.routes.js";
import cors from "cors";
import bcrypt from "bcrypt"
import prisma from "./utils/prismClient.js";
import messageRoutes from "./routes/message.routes.js";
import markRoutes from "./routes/marks.routes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: "https://tapms-1.onrender.com", // Allow frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  credentials: true ,// Allow cookies and credentials
};

app.use(cors(corsOptions))

app.use("/auth" , authRoutes);
app.use("/users" , userRoutes);
app.use("/students" , studentRoutes);~
app.use("/admin" , adminRoutes);
app.use("/faculty" , facultyRoutes);
app.use("/marks" ,markRoutes);
app.use("/messages", messageRoutes);

async function createDefaultAdmin() {
  try {
    const existingAdmin = await prisma.user.findFirst({
      where: { email: "admin@example.com" },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("Admin@123", 10); 

      const adminUser = await prisma.user.create({
        data: {
          email: "admin@example.com",
          name: "Default Admin",
          password: hashedPassword,
          role: "ADMIN",
          department: "CE",
          institute: "CSPIT",
          Admin: {
            create: {
              department: "CE",
            },
          },
        },
      });

      console.log("✅ Default Admin created successfully:", adminUser);
    } else {
      console.log("⚠️ Admin already exists!");
    }
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
// createDefaultAdmin();

const PORT = process.env.PORT || 3000

app.listen(PORT , () => {
    console.log(`http://localhost:${PORT}`);
})
