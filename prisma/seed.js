// prisma/seed.js
import pkg from "@prisma/client";
import bcrypt from "bcryptjs";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("123456", 10);

  // 🟢 super_admin
  await prisma.user.create({
    data: {
      username: "superadmin",
      passwordHash: password,
      role: "super_admin",
      email: "super@demo.com",
    },
  });

  // 🟢 school_admin مرتبط بمدرسة رقم 1
  await prisma.user.create({
    data: {
      username: "schooladmin",
      passwordHash: password,
      role: "school_admin",
      email: "school@demo.com",
      associatedId: 1, // لازم تكون مدرسة id=1 موجودة
    },
  });

  // 🟢 supervisor مرتبط بمدرسة رقم 1
  await prisma.user.create({
    data: {
      username: "supervisor1",
      passwordHash: password,
      role: "supervisor",
      email: "supervisor@demo.com",
      associatedId: 1,
    },
  });

  // 🟢 supplier مرتبط بمورد id=1
  await prisma.user.create({
    data: {
      username: "supplier1",
      passwordHash: password,
      role: "supplier",
      email: "supplier@demo.com",
      associatedId: 1, // لازم مورد id=1 موجود
    },
  });

  console.log("✅ تمت إضافة مستخدمين للتجربة بنجاح");
}

main()
  .catch((e) => {
    console.error("❌ خطأ أثناء إدخال البيانات:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
