// Mongoose MongoDB bilan model va ulanishlarni boshqarish uchun ishlatiladi.
import mongoose from 'mongoose';

// MongoMemoryServer lokal muhitda vaqtinchalik MongoDB ishga tushirish uchun ishlatiladi.
import { MongoMemoryServer } from 'mongodb-memory-server';

// Path fayl yo'llarini platformaga mos shaklda yig'ish uchun ishlatiladi.
import path from 'path';

// execSync lokal MongoDB jarayonlarini tekshirish yoki ishga tushirishda yordam beradi.
import { execSync } from 'child_process';

let memoryServer;

export async function connectDatabase() {
  let uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI sozlanmagan');
  }

  // If user requested to prefer a system/global mongod, try that first.
  if (uri.startsWith('mongodb-memory://') && process.env.MONGOMS_PREFER_GLOBAL_PATH === 'true') {
    try {
      execSync('mongod --version', { stdio: 'ignore' });
      const localUri = process.env.MONGODB_LOCAL_URI || 'mongodb://127.0.0.1:27017/kiber_platforma';
      console.log('System mongod found. Attempting to connect to', localUri);
      await mongoose.connect(localUri, { serverSelectionTimeoutMS: 10000 });
      console.log('Ulandi: system mongod');
      return;
    } catch (err) {
      console.log('System mongod topilmadi yoki ulanib bo‘lmadi, memory-serverga o‘tiladi. Xatolik:', err.message);
    }
  }

  if (uri.startsWith('mongodb-memory://')) {
    const downloadDir = process.env.MONGOMS_DOWNLOAD_DIR ? path.resolve(process.env.MONGOMS_DOWNLOAD_DIR) : undefined;
    const binaryOpts = {
      version: process.env.MONGODB_MEMORY_VERSION || '4.4.29'
    };

    if (downloadDir) {
      binaryOpts.downloadDir = downloadDir;
      console.log('mongodb-memory-server download directory:', downloadDir);
    }

    try {
      console.log('mongodb-memory-server yuklanmoqda (bu bir necha daqiqa olishi mumkin)...');
      memoryServer = await MongoMemoryServer.create({
        binary: binaryOpts,
        instance: {
          dbName: 'kiber_platforma',
          dbPath: process.env.MONGODB_MEMORY_DB_PATH ? path.resolve(process.env.MONGODB_MEMORY_DB_PATH) : undefined,
          storageEngine: process.env.MONGODB_MEMORY_STORAGE_ENGINE || 'wiredTiger'
        }
      });
      uri = memoryServer.getUri();
      console.log('memory-server URI:', uri);
    } catch (err) {
      console.error('mongodb-memory-server yaratishda xatolik:', err.message || err);
      throw err;
    }
  }

  // Connect with a reasonable timeout so failures surface faster.
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 30000 });
  console.log('MongoDB bilan ulanish o‘rnatildi');
}
