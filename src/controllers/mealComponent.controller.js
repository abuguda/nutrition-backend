import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// ✅ جلب جميع المكونات
export const getMealComponents = async (req, res) => {
  try {
    const components = await prisma.mealComponent.findMany();
    res.json(components);
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في جلب المكونات" });
  }
};

// ✅ إضافة مكون
export const createMealComponent = async (req, res) => {
  try {
    const { mealId, componentName, quantity, unit } = req.body;
    const newComponent = await prisma.mealComponent.create({
      data: { mealId, componentName, quantity, unit },
    });
    res.json(newComponent);
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في إضافة المكون" });
  }
};

// ✅ تعديل مكون
export const updateMealComponent = async (req, res) => {
  try {
    const { id } = req.params;
    const { componentName, quantity, unit } = req.body;

    const component = await prisma.mealComponent.findUnique({ where: { id: Number(id) } });
    if (!component) return res.status(404).json({ message: "❌ المكون غير موجود" });

    const updatedComponent = await prisma.mealComponent.update({
      where: { id: Number(id) },
      data: { componentName, quantity, unit },
    });
    res.json(updatedComponent);
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في تعديل المكون" });
  }
};

// ✅ حذف مكون
export const deleteMealComponent = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.mealComponent.delete({ where: { id: Number(id) } });
    res.json({ message: "✅ تم حذف المكون" });
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في حذف المكون" });
  }
};
