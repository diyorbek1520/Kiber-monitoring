# Serverga Joylash

Bu loyiha production uchun Docker Compose orqali serverga joylanadi. Brauzerda ochiladigan asosiy manzil server IP manzili yoki domen bo'ladi.

## 1. Server Talablari

- Ubuntu 22.04 yoki 24.04 VPS
- Docker va Docker Compose
- Kamida 2 GB RAM
- 80-port ochiq bo'lishi kerak
- Domen bo'lsa DNS `A` yozuvi server IP manziliga yo'naltiriladi

## 2. Docker O'rnatish

```bash
sudo apt update
sudo apt install -y ca-certificates curl git
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
```

So'ng serverdan chiqib qayta kiring.

## 3. Loyihani Serverga Yuklash

Git orqali:

```bash
git clone <repo-url>
cd <loyiha-papkasi>
```

Yoki loyiha papkasini serverga ZIP/SFTP orqali yuklang.

## 4. Production Muhitini Sozlash

Serverda loyiha papkasiga kiring va production `.env` faylini yarating:

```bash
cp server/.env.production.example server/.env.production
nano server/.env.production
```

Minimal sozlama:

```env
PORT=5000
MONGODB_URI=mongodb://mongo:27017/kiber_platforma
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4.1-mini
CLIENT_URL=http://SERVER_IP
JWT_SECRET=uzun-va-maxfiy-random-kalit
```

Agar domen ishlatilsa:

```env
CLIENT_URL=https://sizning-domen.uz
```

Muhim: `JWT_SECRET` qiymatini productionda oddiy matn bilan qoldirmang. Kamida 32-64 belgili random kalit yozing.

## 5. Tizimni Ishga Tushirish

```bash
docker compose up -d --build
```

Bu buyruq 3 ta servisni ishga tushiradi:

- `mongo` - MongoDB ma'lumotlar bazasi
- `server` - Express backend API
- `client` - Nginx orqali React frontend

## 6. Tekshirish

Servislar holati:

```bash
docker compose ps
```

Backend ishlayotganini tekshirish:

```bash
curl http://127.0.0.1/api/salomatlik
```

Javob:

```json
{"holat":"ishlayapti"}
```

Loglarni ko'rish:

```bash
docker compose logs -f server
docker compose logs -f client
docker compose logs -f mongo
```

## 7. Brauzerda Ochish

Server IP orqali:

```text
http://SERVER_IP
```

Domen orqali:

```text
https://sizning-domen.uz
```

Frontend ichida API manzili `/api` qilib build qilinadi. Nginx `/api` so'rovlarini backenddagi `server:5000` servisiga yuboradi.

## 8. Ma'lumotlar Saqlanishi

MongoDB ma'lumotlari Docker volume ichida saqlanadi:

```text
mongo_data
```

Shu sababli brauzer yopilganda, server qayta ishga tushganda yoki konteyner restart bo'lganda foydalanuvchilar, tarix, hisobotlar va tahlil natijalari saqlanib qoladi.

## 9. Yangilash

Kod yangilangandan keyin:

```bash
docker compose down
docker compose up -d --build
```

Ma'lumotlarni o'chirmoqchi bo'lmasangiz `docker compose down -v` ishlatmang.

## 10. Asosiy Fayllar

- `docker-compose.yml` - production servislar
- `client/Dockerfile` - React build va Nginx
- `client/nginx.conf` - frontend va `/api` proxy
- `server/Dockerfile` - backend container
- `server/.env.production` - production maxfiy sozlamalar
- `server/.env.production.example` - production sozlama namunasi
