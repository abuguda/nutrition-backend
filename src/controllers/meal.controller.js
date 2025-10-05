import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// ✅ جلب جميع الوجبات
export const getMeals = async (req, res) => {
  try {
    const meals = await prisma.meal.findMany({
      include: { components: true, deliveries: true },
    });
    res.json(meals);
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في جلب الوجبات" });
  }
};

// ✅ جلب وجبة واحدة
export const getMealById = async (req, res) => {
  try {
    const { id } = req.params;
    const meal = await prisma.meal.findUnique({
      where: { id: Number(id) },
      include: { components: true, deliveries: true },
    });
    if (!meal) return res.status(404).json({ message: "❌ الوجبة غير موجودة" });
    res.json(meal);
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في جلب بيانات الوجبة" });
  }
};

// ✅ إضافة وجبة
export const createMeal = async (req, res) => {
  try {
    const { name, description, activeFlag } = req.body;
    const newMeal = await prisma.meal.create({
      data: { name, description, activeFlag },
    });
    res.json(newMeal);
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في إضافة الوجبة" });
  }
};

// ✅ تعديل وجبة
export const updateMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, activeFlag } = req.body;

    const meal = await prisma.meal.findUnique({ where: { id: Number(id) } });
    if (!meal) return res.status(404).json({ message: "❌ الوجبة غير موجودة" });

    const updatedMeal = await prisma.meal.update({
      where: { id: Number(id) },
      data: { name, description, activeFlag },
    });
    res.json(updatedMeal);
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في تعديل الوجبة" });
  }
};

// ✅ حذف وجبة
export const deleteMeal = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.meal.delete({ where: { id: Number(id) } });
    res.json({ message: "✅ تم حذف الوجبة" });
  } catch (err) {
    res.status(500).json({ message: "❌ خطأ في حذف الوجبة" });
  }
};
