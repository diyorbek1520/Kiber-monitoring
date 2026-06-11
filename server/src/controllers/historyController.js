// Analysis modeli oldingi tahlil va maslahatlar tarixini olish uchun ishlatiladi.
import { Analysis } from '../models/Analysis.js';

export async function getHistory(req, res) {
  const items = await Analysis.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(100).lean();
  res.json({ natijalar: items });
}
