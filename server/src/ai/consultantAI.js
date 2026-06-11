// askUzbekAI foydalanuvchi savollariga o'zbek tilida maslahat javobi olish uchun ishlatiladi.
import { askUzbekAI } from './openaiClient.js';

export async function answerConsultantQuestion({ question, history = [] }) {
  const previous = history
    .slice(-6)
    .map((item) => `${item.rol}: ${item.matn}`)
    .join('\n');

  return askUzbekAI({
    temperature: 0.55,
    system: 'Sen kichik biznes va startaplar uchun kiberxavfsizlik bo‘yicha amaliy maslahatchisan. Javoblaring aniq, bosqichma-bosqich va amalga oshiriladigan bo‘lsin.',
    user: `Oldingi suhbat:\n${previous || 'Yo‘q'}\n\nSavol:\n${question}`
  });
}
