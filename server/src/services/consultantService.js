// AI moduli kiberxavfsizlik savollariga maslahatchi javobini olish uchun ishlatiladi.
import { answerConsultantQuestion } from '../ai/consultantAI.js';

export async function askConsultant({ question, history }) {
  if (!question || typeof question !== 'string' || question.trim().length < 3) {
    const error = new Error('Savol kiritilmadi');
    error.status = 400;
    error.publicMessage = 'Maslahatchiga savol yozing';
    throw error;
  }

  const javob = await answerConsultantQuestion({ question: question.trim(), history });
  return { javob };
}
