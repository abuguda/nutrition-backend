import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// ✅ إحضار جميع المدارس
export const getSchools = async (req, res) => {
  try {
    const schools = await prisma.school.findMany({
      include: { classes: true },
    });
    res.json(schools);
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في جلب المدارس" });
  }
};

// ✅ إحضار مدرسة واحدة
export const getSchoolById = async (req, res) => {
  try {
    const { id } = req.params;
    const school = await prisma.school.findUnique({
      where: { id: Number(id) },
      include: { classes: true },
    });
    if (!school) return res.status(404).json({ message: "❌ المدرسة غير موجودة" });
    res.json(school);
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في جلب بيانات المدرسة" });
  }
};

// ✅ إضافة مدرسة جديدة (فقط super_admin)
export const createSchool = async (req, res) => {
  try {
    const { name, address } = req.body;
    const newSchool = await prisma.school.create({
      data: { name, address },
    });
    res.json(newSchool);
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في إضافة المدرسة" });
  }
};

// ✅ تعديل مدرسة
export const updateSchool = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address } = req.body;

    const school = await prisma.school.findUnique({ where: { id: Number(id) } });
    if (!school) return res.status(404).json({ message: "❌ المدرسة غير موجودة" });

    // ⛔ school_admin يقدر يعدل فقط مدرسته
    if (req.user.role === "school_admin" && req.user.associatedId !== school.id) {
      return res.status(403).json({ message: "❌ غير مسموح لك بتعديل هذه المدرسة" });
    }

    const updatedSchool = await prisma.school.update({
      where: { id: Number(id) },
      data: { name, address },
    });
    res.json(updatedSchool);
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في تعديل المدرسة" });
  }
};

// ✅ حذف مدرسة (فقط super_admin)
export const deleteSchool = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.school.delete({ where: { id: Number(id) } });
    res.json({ message: "✅ تم حذف المدرسة" });
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في حذف المدرسة" });
  }
};
