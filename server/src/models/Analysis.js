// Mongoose tahlil natijalarini MongoDB kolleksiyasida saqlash uchun schema/model yaratadi.
import mongoose from 'mongoose';

const AnalysisSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    turi: { type: String, enum: ['auditor', 'fishing', 'maslahatchi'], required: true },
    kirish: { type: mongoose.Schema.Types.Mixed, required: true },
    natija: { type: mongoose.Schema.Types.Mixed, required: true },
    ball: Number,
    xavfDarajasi: String
  },
  { timestamps: true }
);

export const Analysis = mongoose.model('Analysis', AnalysisSchema);
