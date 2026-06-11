// AI moduli phishing matn yoki URL bo'yicha xavf tahlili va tavsiya olish uchun ishlatiladi.
import { analyzeFishingWithAI } from '../ai/fishingAI.js';

export async function runFishingAnalysis(input) {
  if (!input || typeof input !== 'string' || input.trim().length < 8) {
    const error = new Error('Matn juda qisqa');
    error.status = 400;
    error.publicMessage = 'Tahlil uchun yetarli matn yoki havola kiriting';
    throw error;
  }

  const aiTahlil = await analyzeFishingWithAI(input.trim());
  const probability = extractProbability(aiTahlil);
  return { ehtimol: probability, aiTahlil };
}

function extractProbability(text) {
  const match = text.match(/(\d{1,3})\s*%/);
  if (!match) return null;
  return Math.max(0, Math.min(100, Number(match[1])));
}
