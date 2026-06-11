// bcrypt parollarni bazaga saqlashdan oldin xavfsiz hash qilish uchun ishlatiladi.
import bcrypt from 'bcrypt';

// Mongoose foydalanuvchi ma'lumotlari uchun schema/model yaratadi.
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    ism: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    parolHash: { type: String, required: true },
    tashkilot: { type: String, trim: true, maxlength: 120, default: '' },
    telefon: { type: String, trim: true, maxlength: 40, default: '' }
  },
  { timestamps: true }
);

UserSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id,
    ism: this.ism,
    email: this.email,
    tashkilot: this.tashkilot,
    telefon: this.telefon,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

UserSchema.statics.hashPassword = function hashPassword(password) {
  return bcrypt.hash(password, 12);
};

UserSchema.methods.checkPassword = function checkPassword(password) {
  return bcrypt.compare(password, this.parolHash);
};

export const User = mongoose.model('User', UserSchema);
