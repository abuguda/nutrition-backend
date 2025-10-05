"# nutrition-backend" 
# 🍽️ Nutrition Backend

نظام لإدارة **التغذية المدرسية** (School Nutrition Management System) مبني باستخدام **Node.js + Express + Prisma + MySQL/MariaDB**.

---

## 🚀 المميزات الرئيسية

* إدارة المدارس والفصول والطلاب.
* متابعة الحضور والغياب اليومي للطلاب.
* إدارة الموردين والوجبات ومكوناتها.
* تسجيل عمليات التوريد والتوزيع مع متابعة المخزون.
* تقارير يومية وشهرية عن الحضور والتغذية.
* نظام صلاحيات:

  * `super_admin` 🔑: تحكم كامل.
  * `school_admin`: إدارة مدرسته فقط.
  * `supervisor`: متابعة الحضور والتوزيع.
  * `supplier`: التعامل مع التوريدات.

---

## 🏗️ البنية

```
nutrition-backend/
├── prisma/                 # Prisma schema & migrations
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── config/             # الإعدادات والمتغيرات
│   ├── middlewares/        # Middleware (auth, error handler)
│   ├── routes/             # API Routes
│   ├── controllers/        # Controllers
│   ├── services/           # Business logic
│   ├── utils/              # أدوات مساعدة (JWT, errors)
│   └── app.js              # Express App
├── server.js               # نقطة البداية
├── package.json
└── README.md
```

---

## ⚙️ التشغيل محليًا

1. **تثبيت الاعتمادات:**

   ```bash
   npm install
   ```

2. **إعداد قاعدة البيانات:**

   * تأكد أن لديك **MariaDB/MySQL** يعمل.
   * عدل ملف `.env`:

     ```
     DATABASE_URL="mysql://user:password@localhost:3306/nutritiondb"
     JWT_SECRET="secret"
     ```

3. **تهيئة Prisma:**

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **إضافة بيانات تجريبية:**

   ```bash
   npm run seed
   ```

5. **تشغيل الخادم:**

   ```bash
   npm run dev
   ```

   الخادم سيعمل على:
   👉 [http://localhost:4000](http://localhost:4000)

---

## 📬 الـ API (مثال سريع)

* **تسجيل الدخول:**

  ```
  POST /api/auth/login
  { "username": "admin", "password": "123456" }
  ```

* **إضافة مدرسة (فقط super_admin):**

  ```
  POST /api/schools
  Authorization: Bearer <token>
  { "name": "مدرسة النيل", "address": "القاهرة - مصر" }
  ```

---

## 📌 TODO

* إضافة واجهة أمامية (React / Next.js).
* توليد تقارير PDF مباشرة من النظام.
* تحسين إدارة المخزون وربط مباشر بالكميات.
* إضافة وحدة Notifications.

---
