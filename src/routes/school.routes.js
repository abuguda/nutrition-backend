import express from "express";
import { authMiddleware, authorize } from "../middlewares/auth.js";
import {
  getSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
} from "../controllers/school.controller.js";

const router = express.Router();

// 📌 عرض كل المدارس (أي مستخدم مسجل دخول)
router.get("/", authMiddleware, getSchools);

// 📌 عرض مدرسة واحدة
router.get("/:id", authMiddleware, getSchoolById);

// 📌 إضافة مدرسة جديدة (فقط super_admin)
router.post("/", authMiddleware, authorize(["super_admin"]), createSchool);

// 📌 تعديل مدرسة (super_admin أو school_admin للمدرسة الخاصة به)
router.put("/:id", authMiddleware, authorize(["super_admin", "school_admin"]), updateSchool);

// 📌 حذف مدرسة (فقط super_admin)
router.delete("/:id", authMiddleware, authorize(["super_admin"]), deleteSchool);

export default router;
