// Validator email va profil qiymatlarini tekshirish uchun ishlatiladi.
import validator from 'validator';

// User modeli ro'yxatdan o'tish, kirish va profil tahrirlash uchun ishlatiladi.
import { User } from '../models/User.js';

// JWT helper foydalanuvchiga auth token yaratish uchun ishlatiladi.
import { signAuthToken } from '../utils/authToken.js';

export async function register(req, res) {
  const { ism, email, parol, tashkilot = '', telefon = '' } = req.body;
  validateRegister({ ism, email, parol });

  const normalizedEmail = email.trim().toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    res.status(409).json({ xabar: 'Bu email bilan foydalanuvchi mavjud' });
    return;
  }

  const user = await User.create({
    ism: ism.trim(),
    email: normalizedEmail,
    parolHash: await User.hashPassword(parol),
    tashkilot: tashkilot.trim(),
    telefon: telefon.trim()
  });

  res.status(201).json({ token: signAuthToken(user), user: user.toPublicJSON() });
}

export async function login(req, res) {
  const { email, parol } = req.body;
  if (!email || !parol) {
    res.status(400).json({ xabar: 'Email va parol kiritilishi kerak' });
    return;
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user || !(await user.checkPassword(parol))) {
    res.status(401).json({ xabar: 'Email yoki parol noto‘g‘ri' });
    return;
  }

  res.json({ token: signAuthToken(user), user: user.toPublicJSON() });
}

export async function getProfile(req, res) {
  res.json({ user: req.user.toPublicJSON() });
}

export async function updateProfile(req, res) {
  const { ism, email, tashkilot = '', telefon = '', joriyParol, yangiParol } = req.body;

  if (!ism || ism.trim().length < 2) {
    res.status(400).json({ xabar: 'Ism kamida 2 ta belgidan iborat bo‘lishi kerak' });
    return;
  }

  if (!email || !validator.isEmail(email)) {
    res.status(400).json({ xabar: 'Email noto‘g‘ri kiritilgan' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail !== req.user.email) {
    const existing = await User.findOne({ email: normalizedEmail, _id: { $ne: req.user._id } });
    if (existing) {
      res.status(409).json({ xabar: 'Bu email bilan foydalanuvchi mavjud' });
      return;
    }
    req.user.email = normalizedEmail;
  }

  req.user.ism = ism.trim();
  req.user.tashkilot = tashkilot.trim();
  req.user.telefon = telefon.trim();

  if (yangiParol) {
    if (!joriyParol || !(await req.user.checkPassword(joriyParol))) {
      res.status(400).json({ xabar: 'Joriy parol noto‘g‘ri' });
      return;
    }
    if (yangiParol.length < 6) {
      res.status(400).json({ xabar: 'Yangi parol kamida 6 ta belgidan iborat bo‘lishi kerak' });
      return;
    }
    req.user.parolHash = await User.hashPassword(yangiParol);
  }

  await req.user.save();
  res.json({ user: req.user.toPublicJSON() });
}

function validateRegister({ ism, email, parol }) {
  const errors = [];
  if (!ism || ism.trim().length < 2) errors.push('Ism kamida 2 ta belgidan iborat bo‘lishi kerak');
  if (!email || !validator.isEmail(email)) errors.push('Email noto‘g‘ri kiritilgan');
  if (!parol || parol.length < 6) errors.push('Parol kamida 6 ta belgidan iborat bo‘lishi kerak');

  if (errors.length) {
    const error = new Error(errors[0]);
    error.status = 400;
    error.publicMessage = errors[0];
    throw error;
  }
}
