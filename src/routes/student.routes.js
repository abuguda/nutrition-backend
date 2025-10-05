import express from "express";
import { authMiddleware, authorize } from "../middlewares/auth.js";
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/student.controller.js";

const router = express.Router();

// 📌 عرض كل الطلاب
router.get("/", authMiddleware, getStudents);

// 📌 عرض طالب واحد
router.get("/:id", authMiddleware, getStudentById);

// 📌 إضافة طالب (super_admin أو school_admin فقط)
router.post("/", authMiddleware, authorize(["super_admin", "school_admin"]), createStudent);

// 📌 تعديل طالب
router.put("/:id", authMiddleware, authorize(["super_admin", "school_admin"]), updateStudent);

// 📌 حذف طالب
router.delete("/:id", authMiddleware, authorize(["super_admin", "school_admin"]), deleteStudent);

export default router;
