const { Transaction } = require('../models');

exports.getAll = async (req, res) => {
  const transactions = await Transaction.findAll({ where: { userId: req.user.id } });
  res.json(transactions);
};

exports.create = async (req, res) => {
  const { title, amount, date } = req.body;
  const transaction = await Transaction.create({
    title,
    amount,
    date,
    userId: req.user.id
  });
  res.status(201).json(transaction);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const transaction = await Transaction.findOne({ where: { id, userId: req.user.id } });
  if (!transaction) return res.status(404).json({ message: 'Kayıt bulunamadı' });

  await transaction.update(req.body);
  res.json(transaction);
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  const transaction = await Transaction.findOne({ where: { id, userId: req.user.id } });
  if (!transaction) return res.status(404).json({ message: 'Kayıt bulunamadı' });

  await transaction.destroy();
  res.json({ message: 'Silindi' });
};
