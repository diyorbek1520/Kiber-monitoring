// File system moduli foydalanuvchi, tarix va hisobotlarni JSON faylda saqlash uchun ishlatiladi.
import fs from 'node:fs/promises';

// Path moduli JSON bazaning joylashuvini platformaga mos tuzish uchun ishlatiladi.
import path from 'node:path';

const dataDir = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.resolve(process.cwd(), 'data');
const dataFile = path.join(dataDir, 'db.json');
let writeQueue = Promise.resolve();

export async function initializeDataStore() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(createEmptyStore(), null, 2));
  }
}

export async function readStore() {
  await initializeDataStore();
  const raw = await fs.readFile(dataFile, 'utf8');
  const parsed = raw.trim() ? JSON.parse(raw) : createEmptyStore();

  return {
    users: Array.isArray(parsed.users) ? parsed.users : [],
    analyses: Array.isArray(parsed.analyses) ? parsed.analyses : []
  };
}

export function updateStore(mutator) {
  writeQueue = writeQueue.then(async () => {
    const store = await readStore();
    const result = await mutator(store);
    await fs.writeFile(dataFile, JSON.stringify(store, null, 2));
    return result;
  });

  return writeQueue;
}

function createEmptyStore() {
  return {
    users: [],
    analyses: []
  };
}
