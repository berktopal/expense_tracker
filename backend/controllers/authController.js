const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (typeof username !== 'string' || !username.trim() || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ message: 'Kullanıcı adı zorunlu, şifre en az 8 karakter olmalıdır.' });
  }
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed });
    res.status(201).json({ message: 'Kayıt başarılı', userId: user.id });
  } catch {
    res.status(400).json({ message: 'Kayıt başarısız' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Kullanıcı var/yok bilgisi sızmasın diye tek tip hata mesajı
    const user = typeof username === 'string' ? await User.findOne({ where: { username } }) : null;
    const match = user && typeof password === 'string' && await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Kullanıcı adı veya şifre hatalı' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '1d' });
    res.json({ token });
  } catch {
    res.status(500).json({ message: 'Giriş başarısız' });
  }
};

exports.me = async (req, res) => {
  res.json({ id: req.user.id, username: req.user.username });
};
