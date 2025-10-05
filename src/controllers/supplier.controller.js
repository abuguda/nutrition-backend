import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// ✅ إحضار جميع الموردين (فقط super_admin)
export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: { deliveries: true },
    });
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في جلب الموردين" });
  }
};

// ✅ إحضار مورد واحد
export const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await prisma.supplier.findUnique({
      where: { id: Number(id) },
      include: { deliveries: true },
    });
    if (!supplier) return res.status(404).json({ message: "❌ المورد غير موجود" });
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في جلب بيانات المورد" });
  }
};

// ✅ إضافة مورد جديد (super_admin فقط)
export const createSupplier = async (req, res) => {
  try {
    const { name, contactInfo } = req.body;
    const newSupplier = await prisma.supplier.create({
      data: { name, contactInfo },
    });
    res.json(newSupplier);
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في إضافة المورد" });
  }
};

// ✅ تعديل مورد
export const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contactInfo } = req.body;

    const supplier = await prisma.supplier.findUnique({ where: { id: Number(id) } });
    if (!supplier) return res.status(404).json({ message: "❌ المورد غير موجود" });

    const updatedSupplier = await prisma.supplier.update({
      where: { id: Number(id) },
      data: { name, contactInfo },
    });
    res.json(updatedSupplier);
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في تعديل المورد" });
  }
};

// ✅ حذف مورد (super_admin فقط)
export const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.supplier.delete({ where: { id: Number(id) } });
    res.json({ message: "✅ تم حذف المورد" });
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في حذف المورد" });
  }
};
