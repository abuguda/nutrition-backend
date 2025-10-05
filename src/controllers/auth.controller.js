import pkg from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";   // ✅ استدعاء bcrypt

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: "❌ مستخدم غير موجود" });
    }

    // ✅ مقارنة كلمة المرور المدخلة مع الهاش المخزن
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "❌ كلمة المرور غير صحيحة" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({ message: "✅ تسجيل دخول ناجح", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "❌ خطأ داخلي" });
  }
};
