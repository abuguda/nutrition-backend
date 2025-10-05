// routes/meal.routes.js
import express from "express";
import { authMiddleware, authorize } from "../middlewares/auth.js";
import {
  getMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
} from "../controllers/meal.controller.js";

const router = express.Router();

router.use(authMiddleware);

// ✅ يمكن لـ super_admin و supplier إدارة الوجبات
router.get("/", authorize(["super_admin", "supplier"]), getMeals);
router.get("/:id", authorize(["super_admin", "supplier"]), getMealById);
router.post("/", authorize(["super_admin", "supplier"]), createMeal);
router.put("/:id", authorize(["super_admin", "supplier"]), updateMeal);
router.delete("/:id", authorize(["super_admin"]), deleteMeal);

export default router;
