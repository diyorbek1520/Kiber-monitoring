// OpenAI kutubxonasi AI modelga so'rov yuborish va javob olish uchun ishlatiladi.
import OpenAI from 'openai';

export function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    const error = new Error('OPENAI_API_KEY sozlanmagan');
    error.status = 500;
    error.publicMessage = 'AI xizmati uchun API kalit sozlanmagan';
    throw error;
  }

  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function askUzbekAI({ system, user, temperature = 0.4 }) {
  const client = getOpenAIClient();
  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
    temperature,
    messages: [
      { role: 'system', content: `${system}\nJavobni faqat o‘zbek tilida yoz. Inglizcha interfeys so‘zlarini ishlatma.` },
      { role: 'user', content: user }
    ]
  });

  return response.choices?.[0]?.message?.content?.trim() || '';
}
