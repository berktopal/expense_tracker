const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/transactions', transactionRoutes);

module.exports = app;
