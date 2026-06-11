// JsonWebToken foydalanuvchi sessiyasi uchun imzolangan token yaratish va tekshirishda ishlatiladi.
import jwt from 'jsonwebtoken';

const fallbackSecret = 'dev-jwt-secret-change-me';

export function getJwtSecret() {
  return process.env.JWT_SECRET || fallbackSecret;
}

export function signAuthToken(user) {
  return jwt.sign({ sub: user._id.toString(), email: user.email }, getJwtSecret(), { expiresIn: '7d' });
}

export function verifyAuthToken(token) {
  return jwt.verify(token, getJwtSecret());
}
