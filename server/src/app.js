// Express backend API serverini yaratish va middleware ulash uchun ishlatiladi.
import express from 'express';

// CORS frontenddan backendga ruxsatli so'rov yuborish uchun ishlatiladi.
import cors from 'cors';

// Helmet xavfsizlik HTTP headerlarini avtomatik qo'shish uchun ishlatiladi.
import helmet from 'helmet';

// Route modullari API endpointlarini alohida bo'limlarga ajratish uchun ishlatiladi.
import authRoutes from './routes/authRoutes.js';
import auditorRoutes from './routes/auditorRoutes.js';
import fishingRoutes from './routes/fishingRoutes.js';
import consultantRoutes from './routes/consultantRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import historyRoutes from './routes/historyRoutes.js';

// Error handler barcha endpointlarda xatolarni yagona formatda qaytarish uchun ishlatiladi.
import { errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: getAllowedOrigins() }));
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/salomatlik', (req, res) => {
    res.json({ holat: 'ishlayapti' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/auditor', auditorRoutes);
  app.use('/api/fishing', fishingRoutes);
  app.use('/api/maslahatchi', consultantRoutes);
  app.use('/api/hisobotlar', reportRoutes);
  app.use('/api/tarix', historyRoutes);
  app.use(errorHandler);

  return app;
}

function getAllowedOrigins() {
  const configured = [
    process.env.CLIENT_URL,
    process.env.CLIENT_URLS
  ]
    .filter(Boolean)
    .flatMap((value) => value.split(','))
    .map((value) => value.trim())
    .filter(Boolean);

  const allowed = configured.length ? configured : ['http://localhost:5173'];

  return (origin, callback) => {
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('CORS ruxsat berilmagan origin'));
  };
}
