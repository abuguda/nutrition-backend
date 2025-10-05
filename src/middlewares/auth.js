// src/middlewares/auth.js
import jwt from "jsonwebtoken";

// ✅ التحقق من التوكن فقط
export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    if (!authHeader) return res.status(401).json({ message: "❌ لا يوجد توكن" });

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "❌ شكل التوكن غير صحيح" });
    }

    const token = parts[1];
    const secret = process.env.JWT_SECRET || "secret";
    const decoded = jwt.verify(token, secret);

    req.user = decoded; // { id, role, iat, exp }
    next();
  } catch (err) {
    return res.status(403).json({ message: "❌ توكن غير صالح أو منتهي" });
  }
}

// ✅ التحقق من الصلاحيات (Authorization)
export function authorize(roles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "❌ غير مصرح لك بالوصول" });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "❌ لا تملك الصلاحيات الكافية" });
    }

    next();
  };
}
