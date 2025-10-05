import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// ✅ إحضار كل الفصول (مقيدة حسب الدور)
export const getClasses = async (req, res) => {
  try {
    let classes;

    if (req.user.role === "super_admin") {
      // يشوف كل الفصول
      classes = await prisma.class.findMany({
        include: { students: true, school: true },
      });
    } else if (req.user.role === "school_admin") {
      // يشوف فقط الفصول التابعة لمدرسته
      classes = await prisma.class.findMany({
        where: { schoolId: req.user.associatedId },
        include: { students: true, school: true },
      });
    } else {
      return res.status(403).json({ message: "❌ غير مسموح لك بعرض الفصول" });
    }

    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في جلب الفصول" });
  }
};

// ✅ إحضار فصل واحد (مقيدة حسب الدور)
export const getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const cls = await prisma.class.findUnique({
      where: { id: Number(id) },
      include: { students: true, school: true },
    });

    if (!cls) return res.status(404).json({ message: "❌ الفصل غير موجود" });

    if (
      req.user.role !== "super_admin" &&
      !(req.user.role === "school_admin" && req.user.associatedId === cls.schoolId)
    ) {
      return res.status(403).json({ message: "❌ غير مسموح لك بعرض هذا الفصل" });
    }

    res.json(cls);
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في جلب بيانات الفصل" });
  }
};

// ✅ إضافة فصل جديد
export const createClass = async (req, res) => {
  try {
    const { schoolId, name, gradeLevel } = req.body;

    if (req.user.role === "school_admin" && req.user.associatedId !== schoolId) {
      return res.status(403).json({ message: "❌ غير مسموح لك بإضافة فصل لمدرسة أخرى" });
    }

    const newClass = await prisma.class.create({
      data: { schoolId, name, gradeLevel },
    });
    res.json(newClass);
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في إضافة الفصل" });
  }
};

// ✅ تعديل فصل
export const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, gradeLevel } = req.body;

    const cls = await prisma.class.findUnique({ where: { id: Number(id) } });
    if (!cls) return res.status(404).json({ message: "❌ الفصل غير موجود" });

    if (
      req.user.role !== "super_admin" &&
      !(req.user.role === "school_admin" && req.user.associatedId === cls.schoolId)
    ) {
      return res.status(403).json({ message: "❌ غير مسموح لك بتعديل هذا الفصل" });
    }

    const updatedClass = await prisma.class.update({
      where: { id: Number(id) },
      data: { name, gradeLevel },
    });
    res.json(updatedClass);
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في تعديل الفصل" });
  }
};

// ✅ حذف فصل
export const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;

    const cls = await prisma.class.findUnique({ where: { id: Number(id) } });
    if (!cls) return res.status(404).json({ message: "❌ الفصل غير موجود" });

    if (
      req.user.role !== "super_admin" &&
      !(req.user.role === "school_admin" && req.user.associatedId === cls.schoolId)
    ) {
      return res.status(403).json({ message: "❌ غير مسموح لك بحذف هذا الفصل" });
    }

    await prisma.class.delete({ where: { id: Number(id) } });
    res.json({ message: "✅ تم حذف الفصل" });
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في حذف الفصل" });
  }
};
