import express from "express";
import { authMiddleware, authorize } from "../middlewares/auth.js";
import {
  getAttendance,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} from "../controllers/attendance.controller.js";

const router = express.Router();

// 📌 عرض كل سجلات الحضور (super_admin أو school_admin فقط)
router.get("/", authMiddleware, authorize(["super_admin", "school_admin"]), getAttendance);

// 📌 عرض سجل حضور واحد
router.get("/:id", authMiddleware, authorize(["super_admin", "school_admin"]), getAttendanceById);

// 📌 تسجيل حضور/غياب جديد
router.post("/", authMiddleware, authorize(["super_admin", "school_admin"]), createAttendance);

// 📌 تعديل سجل حضور
router.put("/:id", authMiddleware, authorize(["super_admin", "school_admin"]), updateAttendance);

// 📌 حذف سجل حضور
router.delete("/:id", authMiddleware, authorize(["super_admin", "school_admin"]), deleteAttendance);

export default router;
