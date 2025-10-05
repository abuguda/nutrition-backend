import express from "express";
import { authMiddleware, authorize } from "../middlewares/auth.js";
import {
  getMealComponents,
  createMealComponent,
  updateMealComponent,
  deleteMealComponent,
} from "../controllers/mealComponent.controller.js";

const router = express.Router();

router.use(authMiddleware);

// ✅ إدارة المكونات → super_admin و supplier
router.get("/", authorize(["super_admin", "supplier"]), getMealComponents);
router.post("/", authorize(["super_admin", "supplier"]), createMealComponent);
router.put("/:id", authorize(["super_admin", "supplier"]), updateMealComponent);
router.delete("/:id", authorize(["super_admin"]), deleteMealComponent);

export default router;
