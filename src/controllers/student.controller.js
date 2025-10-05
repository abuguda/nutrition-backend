import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// ✅ إحضار كل الطلاب (مقيدة حسب الدور)
export const getStudents = async (req, res) => {
  try {
    let students;

    if (req.user.role === "super_admin") {
      students = await prisma.student.findMany({
        include: { class: { include: { school: true } } },
      });
    } else if (req.user.role === "school_admin") {
      students = await prisma.student.findMany({
        where: { class: { schoolId: req.user.associatedId } },
        include: { class: { include: { school: true } } },
      });
    } else {
      return res.status(403).json({ message: "❌ غير مسموح لك بعرض الطلاب" });
    }

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في جلب الطلاب" });
  }
};

// ✅ إحضار طالب واحد
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await prisma.student.findUnique({
      where: { id: Number(id) },
      include: { class: { include: { school: true } } },
    });

    if (!student) return res.status(404).json({ message: "❌ الطالب غير موجود" });

    if (
      req.user.role !== "super_admin" &&
      !(req.user.role === "school_admin" && req.user.associatedId === student.class.schoolId)
    ) {
      return res.status(403).json({ message: "❌ غير مسموح لك بعرض هذا الطالب" });
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في جلب بيانات الطالب" });
  }
};

// ✅ إضافة طالب جديد
export const createStudent = async (req, res) => {
  try {
    const { classId, name, gender, birthDate, status } = req.body;

    // التحقق من ملكية الفصل
    const cls = await prisma.class.findUnique({ where: { id: classId } });
    if (!cls) return res.status(404).json({ message: "❌ الفصل غير موجود" });

    if (req.user.role === "school_admin" && req.user.associatedId !== cls.schoolId) {
      return res.status(403).json({ message: "❌ غير مسموح لك بإضافة طلاب لفصل في مدرسة أخرى" });
    }

    const newStudent = await prisma.student.create({
      data: { classId, name, gender, birthDate, status },
    });
    res.json(newStudent);
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في إضافة الطالب" });
  }
};

// ✅ تعديل طالب
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, gender, birthDate, status } = req.body;

    const student = await prisma.student.findUnique({
      where: { id: Number(id) },
      include: { class: true },
    });
    if (!student) return res.status(404).json({ message: "❌ الطالب غير موجود" });

    if (
      req.user.role !== "super_admin" &&
      !(req.user.role === "school_admin" && req.user.associatedId === student.class.schoolId)
    ) {
      return res.status(403).json({ message: "❌ غير مسموح لك بتعديل هذا الطالب" });
    }

    const updatedStudent = await prisma.student.update({
      where: { id: Number(id) },
      data: { name, gender, birthDate, status },
    });
    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في تعديل الطالب" });
  }
};

// ✅ حذف طالب
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: { id: Number(id) },
      include: { class: true },
    });
    if (!student) return res.status(404).json({ message: "❌ الطالب غير موجود" });

    if (
      req.user.role !== "super_admin" &&
      !(req.user.role === "school_admin" && req.user.associatedId === student.class.schoolId)
    ) {
      return res.status(403).json({ message: "❌ غير مسموح لك بحذف هذا الطالب" });
    }

    await prisma.student.delete({ where: { id: Number(id) } });
    res.json({ message: "✅ تم حذف الطالب" });
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في حذف الطالب" });
  }
};
