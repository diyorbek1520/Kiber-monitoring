// child_process execFile tashqi port skanerlash utilitalarini xavfsiz ishga tushirish uchun ishlatiladi.
import { execFile } from 'node:child_process';

// promisify callback asosidagi execFile funksiyasini async/await bilan ishlatish uchun kerak.
import { promisify } from 'node:util';

// FS moduli tizimda port skaner utilitasi borligini tekshirish uchun ishlatiladi.
import fs from 'node:fs';

const execFileAsync = promisify(execFile);
const PORTS = [21, 22, 23, 25, 53, 80, 110, 143, 443, 3306, 5432, 27017];
const NMAP_CANDIDATES = [
  'nmap',
  'C:\\Program Files\\Nmap\\nmap.exe',
  'C:\\Program Files (x86)\\Nmap\\nmap.exe'
];

export async function scanPorts(host) {
  try {
    const nmapPath = findNmapPath();
    const { stdout } = await execFileAsync(nmapPath, ['-Pn', '-p', PORTS.join(','), '--open', host], { timeout: 20000 });
    return parseNmap(stdout);
  } catch (error) {
    return PORTS.map((port) => ({
      port,
      ochiq: false,
      xizmat: null,
      izoh: error.code === 'ENOENT' ? 'nmap o‘rnatilmagan' : 'tekshiruv bajarilmadi'
    }));
  }
}

function parseNmap(output) {
  return PORTS.map((port) => {
    const line = output.split('\n').find((row) => row.trim().startsWith(`${port}/tcp`));
    if (!line) return { port, ochiq: false, xizmat: null, izoh: null };
    const parts = line.trim().split(/\s+/);
    return { port, ochiq: parts[1] === 'open', xizmat: parts[2] || null, izoh: null };
  });
}

function findNmapPath() {
  return NMAP_CANDIDATES.find((candidate) => candidate === 'nmap' || fs.existsSync(candidate)) || 'nmap';
}
