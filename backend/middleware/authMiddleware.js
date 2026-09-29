const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const [scheme, token] = authHeader?.split(' ') ?? [];
  if (scheme !== 'Bearer' || !token) return res.status(401).json({ message: 'Token gerekli' });

  let decoded;
  try {
    // Algoritma sabitlenir: "alg: none" / algoritma karıştırma saldırılarına karşı
    decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
  } catch {
    return res.status(401).json({ message: 'Geçersiz veya süresi dolmuş token' });
  }

  const user = await User.findByPk(decoded.id);
  if (!user) return res.status(401).json({ message: 'Kullanıcı bulunamadı' });

  req.user = user;
  next();
};

module.exports = authenticateToken;
