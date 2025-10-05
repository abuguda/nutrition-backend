import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import schoolRoutes from "./routes/school.routes.js";
import { authMiddleware } from "./middlewares/auth.js";
import classRoutes from "./routes/class.routes.js";
import studentRoutes from "./routes/student.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/schools", authMiddleware, schoolRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);

export default app;
