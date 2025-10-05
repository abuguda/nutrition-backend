import express from "express";
import { authMiddleware, authorize } from "../middlewares/auth.js";
import {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplier.controller.js";

const router = express.Router();

router.use(authMiddleware);

// ✅ الموردين: super_admin فقط يقدر يشوف أو يضيف أو يحذف
router.get("/", authorize(["super_admin"]), getSuppliers);
router.get("/:id", authorize(["super_admin"]), getSupplierById);
router.post("/", authorize(["super_admin"]), createSupplier);
router.put("/:id", authorize(["super_admin"]), updateSupplier);
router.delete("/:id", authorize(["super_admin"]), deleteSupplier);

export default router;
