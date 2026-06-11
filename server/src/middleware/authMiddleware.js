// User modeli token ichidagi foydalanuvchini bazadan topish uchun ishlatiladi.
import { User } from '../models/User.js';

// JWT helper tokenni tekshirish va user id olish uchun ishlatiladi.
import { verifyAuthToken } from '../utils/authToken.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      res.status(401).json({ xabar: 'Avval tizimga kiring' });
      return;
    }

    const payload = verifyAuthToken(token);
    const user = await User.findById(payload.sub);

    if (!user) {
      res.status(401).json({ xabar: 'Foydalanuvchi topilmadi' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ xabar: 'Sessiya muddati tugagan yoki token noto‘g‘ri' });
  }
}
