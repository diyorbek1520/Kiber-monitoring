export function calculateSecurityScore(scan) {
  let score = 100;

  if (!scan.ssl.mavjud) score -= 20;
  if (scan.ssl.muddatiTugagan) score -= 18;
  if (!scan.https.ishlayapti) score -= 18;
  if (!scan.https.hsts) score -= 8;

  const missingHeaders = scan.headers.filter((item) => !item.mavjud).length;
  score -= missingHeaders * 5;

  if (!scan.email.spf.mavjud) score -= 5;
  if (!scan.email.dmarc.mavjud) score -= 7;
  if (!scan.email.dkim.ehtimoliyMavjud) score -= 3;

  const riskyOpenPorts = scan.ports.filter((port) => port.ochiq && [21, 23, 25, 110, 143, 3306, 5432, 27017].includes(port.port)).length;
  score -= riskyOpenPorts * 7;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function getRating(score) {
  if (score >= 85) return 'Juda yaxshi';
  if (score >= 70) return 'Yaxshi';
  if (score >= 50) return 'O‘rta';
  if (score >= 30) return 'Xavfli';
  return 'Juda xavfli';
}
