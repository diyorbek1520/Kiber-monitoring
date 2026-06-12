# Vercel + Render Deploy Qo'llanmasi

Bu loyiha ikki qismdan iborat:

- `client` - React/Vite frontend. Vercelga deploy qilinadi.
- `server` - Express backend API. Renderga deploy qilinadi.

Ma'lumotlar MongoDBda emas, JSON storage orqali saqlanadi. Renderda JSON fayl saqlanib qolishi uchun persistent disk kerak.

## 1. GitHub Ga Push Qilish

Lokal kompyuterda:

```bash
git status
git add -A
git commit -m "Prepare Vercel and Render deployment"
git push origin main
```

GitHub repository:

```text
https://github.com/diyorbek1520/Kiber-monitoring
```

## 2. Backendni Render Ga Joylash

Render dashboardda:

1. `New +` tugmasini bosing.
2. `Web Service` tanlang.
3. GitHub repositoryni ulang.
4. Repository: `diyorbek1520/Kiber-monitoring`
5. Runtime: `Node`
6. Build Command:

```bash
npm install && npm run build --workspace server
```

7. Start Command:

```bash
npm run start --workspace server
```

8. Health Check Path:

```text
/api/salomatlik
```

Render `render.yaml` faylini ham o'qiy oladi. Unda backend service, start/build command, env variables va persistent disk sozlamalari yozilgan.

## 3. Render Environment Variables

Render backend service ichida quyidagi environment variables kiriting:

```env
NODE_ENV=production
PORT=10000
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4.1-mini
JWT_SECRET=uzun-va-maxfiy-random-kalit
DATA_DIR=/var/data
CLIENT_URL=https://YOUR-VERCEL-APP.vercel.app
CLIENT_URLS=https://YOUR-VERCEL-APP.vercel.app
```

Izoh:

- `OPENAI_API_KEY` frontendga berilmaydi, faqat Render backendda bo'ladi.
- `JWT_SECRET` kamida 32-64 belgili random maxfiy kalit bo'lishi kerak.
- `CLIENT_URL` va `CLIENT_URLS` Vercel frontend domenini bildiradi.
- `DATA_DIR=/var/data` Render persistent disk mount path bilan bir xil bo'lishi kerak.

## 4. Render Persistent Disk

JSON storage productionda saqlanib qolishi uchun Render servicega disk ulang:

```yaml
disk:
  name: kiber-monitoring-data
  mountPath: /var/data
  sizeGB: 1
```

Muhim: Render free instance persistent disk bermasligi mumkin. Agar disk ulanmasa, qayta deploy yoki restartdan keyin JSON fayldagi foydalanuvchi, tarix va hisobotlar yo'qolishi mumkin. Doimiy saqlash uchun Render disk yoki tashqi database ishlating.

## 5. Backend URL Ni Olish

Render deploy tugagach backend URL shunday bo'ladi:

```text
https://YOUR-BACKEND.onrender.com
```

Tekshirish:

```text
https://YOUR-BACKEND.onrender.com/api/salomatlik
```

Javob:

```json
{"holat":"ishlayapti"}
```

## 6. Frontendni Vercel Ga Joylash

Vercel dashboardda:

1. `Add New Project` bosing.
2. GitHub repositoryni tanlang.
3. Repository: `diyorbek1520/Kiber-monitoring`
4. Framework Preset: `Vite`
5. Root Directory: repository root qolsin.
6. Build Command:

```bash
npm run build --workspace client
```

7. Output Directory:

```text
client/dist
```

Bu qiymatlar `vercel.json` ichida ham yozilgan.

## 7. Vercel Environment Variables

Vercel project settings ichida quyidagini kiriting:

```env
VITE_API_URL=https://YOUR-BACKEND.onrender.com/api
```

Muhim: Vite frontend browserda ishlatadigan env variable nomlari `VITE_` bilan boshlanishi kerak. Shuning uchun backend URL `VITE_API_URL` orqali beriladi.

## 8. Frontend Va Backendni Ulash

1. Avval backendni Renderga deploy qiling.
2. Render backend URLni oling.
3. Vercelda `VITE_API_URL`ga backend URL + `/api` yozing:

```env
VITE_API_URL=https://YOUR-BACKEND.onrender.com/api
```

4. Vercel frontend deploy qiling.
5. Vercel domenini oling:

```text
https://YOUR-VERCEL-APP.vercel.app
```

6. Renderda `CLIENT_URL` va `CLIENT_URLS`ni shu Vercel domeniga tenglang.
7. Render backendni redeploy qiling.

## 9. Local Development

Frontend env:

```bash
copy client\.env.example client\.env.local
```

`client/.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
```

Backend env:

```bash
copy server\.env.example server\.env
```

`server/.env`:

```env
PORT=5000
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4.1-mini
CLIENT_URL=http://localhost:5173
CLIENT_URLS=http://localhost:5173
JWT_SECRET=change-this-secret-before-production
DATA_DIR=C:\VSCODE\BMI\server\data
```

Ishga tushirish:

```bash
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

## 10. MongoDB Atlas Haqida

MongoDB bu loyihadan olib tashlangan. Hozir backend `server/data/db.json` yoki Renderda `/var/data/db.json` fayli bilan ishlaydi.

Agar keyinchalik MongoDB Atlas Free ishlatmoqchi bo'lsangiz, alohida:

- `mongoose` yoki MongoDB driver o'rnatiladi
- `MONGODB_URI` env variable qo'shiladi
- `User` va `Analysis` modellari MongoDBga qaytariladi

Hozirgi deploy rejasi MongoDBsiz, JSON storage bilan ishlaydi.

## 11. Deployga Halaqit Beradigan Avvalgi Muammolar Va Tuzatishlar

- Frontenddagi hardcoded `localhost` API URL olib tashlandi, endi `VITE_API_URL` ishlatiladi.
- Backend CORS faqat env orqali berilgan frontend domenlardan so'rov qabul qiladi.
- Backend maxfiy kalitlar `.env` orqali ishlaydi.
- Render uchun `build` va `start` script qo'shildi.
- Vercel uchun `vercel.json` qo'shildi.
- JSON storage uchun Render persistent disk sozlandi.
- MongoDB dependencylari olib tashlangan, shuning uchun MongoDB Atlas majburiy emas.
