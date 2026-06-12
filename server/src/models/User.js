// bcrypt parollarni JSON bazaga saqlashdan oldin xavfsiz hash qilish uchun ishlatiladi.
import bcrypt from 'bcrypt';

// Crypto moduli foydalanuvchilar uchun noyob id yaratish uchun ishlatiladi.
import crypto from 'node:crypto';

// JSON storage foydalanuvchi ma'lumotlarini faylda saqlash va o'qish uchun ishlatiladi.
import { readStore, updateStore } from '../storage/jsonStore.js';

export class User {
  constructor(record) {
    Object.assign(this, record);
  }

  toPublicJSON() {
    return {
      id: this._id,
      ism: this.ism,
      email: this.email,
      tashkilot: this.tashkilot,
      telefon: this.telefon,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.parolHash);
  }

  async save() {
    this.updatedAt = new Date().toISOString();
    const current = { ...this };

    await updateStore((store) => {
      const index = store.users.findIndex((user) => user._id === this._id);
      if (index === -1) store.users.push(current);
      else store.users[index] = current;
    });

    return this;
  }

  static hashPassword(password) {
    return bcrypt.hash(password, 12);
  }

  static async create(fields) {
    const now = new Date().toISOString();
    const record = {
      _id: crypto.randomUUID(),
      ism: fields.ism,
      email: fields.email,
      parolHash: fields.parolHash,
      tashkilot: fields.tashkilot || '',
      telefon: fields.telefon || '',
      createdAt: now,
      updatedAt: now
    };

    await updateStore((store) => {
      store.users.push(record);
    });

    return new User(record);
  }

  static async findById(id) {
    const store = await readStore();
    const record = store.users.find((user) => user._id === id);
    return record ? new User(record) : null;
  }

  static async findOne(query) {
    const store = await readStore();
    const record = store.users.find((user) => matchesUser(user, query));
    return record ? new User(record) : null;
  }
}

function matchesUser(user, query) {
  if (query.email && user.email !== query.email) return false;
  if (query._id?.$ne && user._id === String(query._id.$ne)) return false;
  if (typeof query._id === 'string' && user._id !== query._id) return false;
  return true;
}
