// Target util foydalanuvchi kiritgan domen yoki URLni tekshiruvga tayyorlash va DNSda tekshirish uchun ishlatiladi.
import { normalizeTarget, resolveHost } from '../utils/target.js';

// Score util audit natijalaridan umumiy xavfsizlik balli va reytingini hisoblaydi.
import { calculateSecurityScore, getRating } from '../utils/score.js';

// Scanner modullari SSL, header, DNS, email va port tekshiruvlarini bajarish uchun ishlatiladi.
import { scanSSL } from '../scanners/sslScanner.js';
import { scanHeaders } from '../scanners/headerScanner.js';
import { scanDNS } from '../scanners/dnsScanner.js';
import { scanEmailSecurity } from '../scanners/emailScanner.js';
import { scanPorts } from '../scanners/portScanner.js';

// AI moduli audit natijasini oddiy tilda tushuntirib tavsiya berish uchun ishlatiladi.
import { analyzeAuditWithAI } from '../ai/auditorAI.js';

export async function runAudit(input) {
  const target = normalizeTarget(input);
  const resolvedAddresses = await resolveHost(target.host);

  if (resolvedAddresses !== null && !resolvedAddresses.length) {
    const error = new Error('Domen DNS orqali topilmadi');
    error.status = 404;
    error.publicMessage = 'Bunday domen nomi topilmadi';
    throw error;
  }

  const [ssl, headerResult, dns, email, ports] = await Promise.all([
    scanSSL(target.host),
    scanHeaders(target.url),
    scanDNS(target.host),
    scanEmailSecurity(target.host),
    scanPorts(target.host)
  ]);

  const scan = {
    manzil: target,
    ssl,
    https: headerResult.https,
    headers: headerResult.headers,
    email,
    ports,
    dns
  };
  const ball = calculateSecurityScore(scan);
  const baho = getRating(ball);
  const aiTahlil = await analyzeAuditSafely({ ...scan, ball, baho });

  return { ...scan, ball, baho, aiTahlil };
}

async function analyzeAuditSafely(scan) {
  try {
    return await analyzeAuditWithAI(scan);
  } catch (error) {
    console.warn('AI auditor xulosasi olinmadi:', {
      status: error.status,
      code: error.code,
      message: error.message
    });

    return buildLocalAuditSummary(scan);
  }
}

function buildLocalAuditSummary(scan) {
  const issues = [];

  if (!scan.ssl?.mavjud) issues.push('SSL sertifikat topilmadi yoki 443-port orqali tekshirilmadi.');
  if (scan.ssl?.muddatiTugagan) issues.push('SSL sertifikat muddati tugagan yoki amal qilish sanasi aniqlanmadi.');
  if (!scan.https?.ishlayapti) issues.push('HTTPS ishlamayapti yoki sayt HTTP orqali javob berdi.');
  if (!scan.https?.hsts) issues.push('Strict-Transport-Security headeri yoqilmagan.');

  const missingHeaders = scan.headers?.filter((header) => !header.mavjud).map((header) => header.nomi) || [];
  if (missingHeaders.length) {
    issues.push(`Yetishmayotgan xavfsizlik headerlari: ${missingHeaders.join(', ')}.`);
  }

  const openPorts = scan.ports?.filter((port) => port.ochiq).map((port) => `${port.port}${port.xizmat ? `/${port.xizmat}` : ''}`) || [];
  if (openPorts.length) {
    issues.push(`Ochiq portlar topildi: ${openPorts.join(', ')}.`);
  }

  if (!scan.dns?.a?.length) issues.push('A yozuvlari topilmadi.');
  if (!scan.dns?.mx?.length) issues.push('MX yozuvlari topilmadi.');

  const recommendations = [
    'SSL sertifikatni yangilang va barcha trafikni HTTPS ga yo‘naltiring.',
    'HSTS, CSP, X-Frame-Options, X-Content-Type-Options va Referrer-Policy headerlarini sozlang.',
    'Keraksiz ochiq portlarni yopib, faqat zarur xizmatlarni internetga chiqaring.',
    'DNS va email himoyasi yozuvlarini muntazam tekshirib boring.'
  ];

  return [
    `Avtomatik tekshiruv yakunlandi. Umumiy ball: ${scan.ball}/100, baho: ${scan.baho}.`,
    issues.length ? `Topilgan asosiy holatlar:\n- ${issues.join('\n- ')}` : 'Jiddiy muammo topilmadi.',
    `Tavsiya etilgan keyingi qadamlar:\n- ${recommendations.join('\n- ')}`,
    'AI xulosasi hozircha olinmadi, shuning uchun bu lokal skanerlar asosidagi fallback xulosa.'
  ].join('\n\n');
}
