// askUzbekAI phishing matn/URL tahlilini o'zbek tilida tushuntirish uchun ishlatiladi.
import { askUzbekAI } from './openaiClient.js';

export async function analyzeFishingWithAI(input) {
  return askUzbekAI({
    temperature: 0.45,
    system: 'Sen fishing va firibgarlik xabarlarini aniqlovchi kiberxavfsizlik mutaxassisisan. Fishing ehtimolini foizda ko‘rsat, sabablarni ajrat, foydalanuvchi nima qilishi kerakligini tushuntir.',
    user: `Ushbu matn yoki havolani tahlil qil:\n${input}`
  });
}
