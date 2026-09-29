const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

// Zayıf veya eksik JWT anahtarıyla sunucu hiç başlamasın
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET ortam değişkeni en az 32 karakter olmalı. Bkz. backend/.env.example');
}
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// Sadece izin verilen frontend adresi API'ye tarayıcıdan erişebilir
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.disable('x-powered-by');
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/transactions', transactionRoutes);

module.exports = app;
