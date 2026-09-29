const { Transaction } = require('../models');

// İstemciden yalnızca bu alanlar kabul edilir (mass assignment önlemi:
// örn. req.body.userId ile kaydı başka kullanıcıya taşımak engellenir).
const pickTransactionFields = (body = {}) => {
  const fields = {};
  if (body.title !== undefined) fields.title = String(body.title).trim();
  if (body.amount !== undefined) fields.amount = Number(body.amount);
  if (body.date !== undefined) fields.date = body.date;
  return fields;
};

const validate = (fields, { partial }) => {
  if (!partial || fields.title !== undefined) {
    if (!fields.title || fields.title.length > 255) return 'Başlık zorunludur (en fazla 255 karakter).';
  }
  if (!partial || fields.amount !== undefined) {
    if (!Number.isFinite(fields.amount)) return 'Tutar geçerli bir sayı olmalıdır.';
  }
  if (!partial || fields.date !== undefined) {
    if (!fields.date || Number.isNaN(Date.parse(fields.date))) return 'Geçerli bir tarih giriniz.';
  }
  return null;
};

exports.getAll = async (req, res) => {
  const transactions = await Transaction.findAll({ where: { userId: req.user.id } });
  res.json(transactions);
};

exports.create = async (req, res) => {
  const fields = pickTransactionFields(req.body);
  const error = validate(fields, { partial: false });
  if (error) return res.status(400).json({ message: error });

  const transaction = await Transaction.create({ ...fields, userId: req.user.id });
  res.status(201).json(transaction);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const transaction = await Transaction.findOne({ where: { id, userId: req.user.id } });
  if (!transaction) return res.status(404).json({ message: 'Kayıt bulunamadı' });

  const fields = pickTransactionFields(req.body);
  const error = validate(fields, { partial: true });
  if (error) return res.status(400).json({ message: error });

  await transaction.update(fields);
  res.json(transaction);
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  const transaction = await Transaction.findOne({ where: { id, userId: req.user.id } });
  if (!transaction) return res.status(404).json({ message: 'Kayıt bulunamadı' });

  await transaction.destroy();
  res.json({ message: 'Silindi' });
};
