// askUzbekAI audit natijalarini o'zbek tilida AI orqali tahlil qilish uchun ishlatiladi.
import { askUzbekAI } from './openaiClient.js';

export async function analyzeAuditWithAI(scan) {
  return askUzbekAI({
    temperature: 0.35,
    system: 'Sen kichik bizneslar uchun professional kiberxavfsizlik auditori sifatida ishlaysan. Har bir muammo bo‘yicha muammo tavsifi, xavf darajasi, oqibatlari, batafsil yechim va amalga oshirish bosqichlarini ber.',
    user: `Quyidagi haqiqiy texnik tekshiruv natijalarini tahlil qil:\n${JSON.stringify(scan, null, 2)}`
  });
}
