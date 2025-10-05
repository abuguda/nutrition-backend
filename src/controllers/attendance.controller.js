import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// ✅ إحضار كل سجلات الحضور
export const getAttendance = async (req, res) => {
  try {
    let records;

    if (req.user.role === "super_admin") {
      records = await prisma.attendance.findMany({
        include: { student: { include: { class: { include: { school: true } } } } },
      });
    } else if (req.user.role === "school_admin") {
      records = await prisma.attendance.findMany({
        where: { student: { class: { schoolId: req.user.associatedId } } },
        include: { student: { include: { class: true } } },
      });
    } else {
      return res.status(403).json({ message: "❌ غير مسموح لك بعرض الحضور" });
    }

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في جلب سجلات الحضور" });
  }
};

// ✅ إحضار سجل حضور واحد
export const getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await prisma.attendance.findUnique({
      where: { id: Number(id) },
      include: { student: { include: { class: { include: { school: true } } } } },
    });

    if (!record) return res.status(404).json({ message: "❌ السجل غير موجود" });

    if (
      req.user.role !== "super_admin" &&
      !(req.user.role === "school_admin" && req.user.associatedId === record.student.class.schoolId)
    ) {
      return res.status(403).json({ message: "❌ غير مسموح لك بعرض هذا السجل" });
    }

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في جلب السجل" });
  }
};

// ✅ إنشاء سجل حضور جديد
export const createAttendance = async (req, res) => {
  try {
    const { studentId, date, status } = req.body;

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { class: true },
    });
    if (!student) return res.status(404).json({ message: "❌ الطالب غير موجود" });

    if (req.user.role === "school_admin" && req.user.associatedId !== student.class.schoolId) {
      return res.status(403).json({ message: "❌ غير مسموح لك بتسجيل حضور لهذا الطالب" });
    }

    const newRecord = await prisma.attendance.create({
      data: { studentId, date: new Date(date), status },
    });
    res.json(newRecord);
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في إنشاء السجل" });
  }
};

// ✅ تعديل سجل حضور
export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const record = await prisma.attendance.findUnique({
      where: { id: Number(id) },
      include: { student: { include: { class: true } } },
    });
    if (!record) return res.status(404).json({ message: "❌ السجل غير موجود" });

    if (
      req.user.role !== "super_admin" &&
      !(req.user.role === "school_admin" && req.user.associatedId === record.student.class.schoolId)
    ) {
      return res.status(403).json({ message: "❌ غير مسموح لك بتعديل هذا السجل" });
    }

    const updatedRecord = await prisma.attendance.update({
      where: { id: Number(id) },
      data: { status },
    });
    res.json(updatedRecord);
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في تعديل السجل" });
  }
};

// ✅ حذف سجل حضور
export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await prisma.attendance.findUnique({
      where: { id: Number(id) },
      include: { student: { include: { class: true } } },
    });
    if (!record) return res.status(404).json({ message: "❌ السجل غير موجود" });

    if (
      req.user.role !== "super_admin" &&
      !(req.user.role === "school_admin" && req.user.associatedId === record.student.class.schoolId)
    ) {
      return res.status(403).json({ message: "❌ غير مسموح لك بحذف هذا السجل" });
    }

    await prisma.attendance.delete({ where: { id: Number(id) } });
    res.json({ message: "✅ تم حذف السجل" });
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في حذف السجل" });
  }
};
