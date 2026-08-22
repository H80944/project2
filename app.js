const express = require('express');
const morgan = require('morgan');
const path = require('path');
const controller = require("./controller");

// 1. إنشاء تطبيق Express أولاً
const app = express();

// 2. الـ Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
// التعديل هنا: استخدام process.cwd() لضمان الوصول للمجلد الرئيسي
app.use(express.static(path.join(process.cwd(), 'public')));

app.use((req, res, next) => {
  req.body = req.body || {};
  req.body.timestamp = new Date().toISOString();
  next();
});

// 3. المسارات (Routes)
const router = express.Router();
router
  .route('/')
  .post(controller.postCredentials);

app.use('/api/v1', router);

// 4. الصفحة الرئيسية
app.get('/', (req, res) => {
  // التعديل هنا أيضاً
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// 5. التصدير لـ Vercel
module.exports = app;
