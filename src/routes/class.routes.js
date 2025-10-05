import express from "express";
import { authMiddleware, authorize } from "../middlewares/auth.js";
import {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
} from "../controllers/class.controller.js";

const router = express.Router();

// 📌 عرض كل الفصول (أي مستخدم مسجل دخول)
router.get("/", authMiddleware, getClasses);

// 📌 عرض فصل واحد
router.get("/:id", authMiddleware, getClassById);

// 📌 إضافة فصل جديد (super_admin أو school_admin لمدرسته فقط)
router.post("/", authMiddleware, authorize(["super_admin", "school_admin"]), createClass);

// 📌 تعديل فصل
router.put("/:id", authMiddleware, authorize(["super_admin", "school_admin"]), updateClass);

// 📌 حذف فصل
router.delete("/:id", authMiddleware, authorize(["super_admin", "school_admin"]), deleteClass);

export default router;
