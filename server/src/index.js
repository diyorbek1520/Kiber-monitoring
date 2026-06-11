// Dotenv .env fayldagi maxfiy va konfiguratsiya qiymatlarini yuklash uchun ishlatiladi.
import dotenv from 'dotenv';

// App va database modullari serverni ishga tushirish jarayonini yig'ish uchun ishlatiladi.
import { createApp } from './app.js';
import { connectDatabase } from './database/mongo.js';

dotenv.config();

const port = process.env.PORT || 5000;

async function start() {
  await connectDatabase();
  const app = createApp();

  app.listen(port, () => {
    console.log(`Server ${port}-portda ishga tushdi`);
  });
}

start().catch((error) => {
  console.error('Serverni ishga tushirishda xatolik:', error.message);
  process.exit(1);
});
