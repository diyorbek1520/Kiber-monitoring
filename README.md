# AI Kiberxavfsizlik Platformasi

Kichik bizneslar va startaplar uchun o'zbek tilidagi AI asosida ishlovchi kiberxavfsizlik platformasi.

## Ishga tushirish

1. Paketlarni o'rnating:

```bash
npm install
```

2. Server sozlamasini yarating:

```bash
copy server\.env.example server\.env
```

3. `server/.env` ichiga haqiqiy qiymatlarni kiriting:

```env
PORT=5000
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4.1-mini
CLIENT_URL=http://localhost:5173
JWT_SECRET=change-this-secret-before-production
DATA_DIR=C:\VSCODE\BMI\server\data
```

4. `nmap` tizimga o'rnatilgan bo'lishi kerak. Port tekshiruvi haqiqiy `nmap` orqali bajariladi.

5. Loyihani ishga tushiring:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## API yo'llari

- `POST /api/auditor`
- `POST /api/fishing`
- `POST /api/maslahatchi`
- `GET /api/hisobotlar`
- `GET /api/tarix`

Platformada oldindan yozilgan AI javoblari ishlatilmaydi. OpenAI API kaliti berilmasa, AI so'rovlari xatolik qaytaradi.

Ma'lumotlar `server/data/db.json` fayliga saqlanadi.

# Kiber-monitoring
