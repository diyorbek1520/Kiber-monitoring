// TLS moduli sayt sertifikatini olib, SSL holatini tekshirish uchun ishlatiladi.
import tls from 'node:tls';

export function scanSSL(host) {
  return new Promise((resolve) => {
    const socket = tls.connect(
      { host, port: 443, servername: host, rejectUnauthorized: false, timeout: 8000 },
      () => {
        const certificate = socket.getPeerCertificate();
        const validTo = certificate.valid_to ? new Date(certificate.valid_to) : null;
        socket.end();
        resolve({
          mavjud: Boolean(certificate && certificate.subject),
          amalQilishMuddati: validTo?.toISOString() || null,
          muddatiTugagan: validTo ? validTo.getTime() < Date.now() : true,
          beruvchi: certificate.issuer?.O || certificate.issuer?.CN || 'Noma’lum',
          mavzu: certificate.subject?.CN || host
        });
      }
    );

    socket.on('error', () => resolve({ mavjud: false, amalQilishMuddati: null, muddatiTugagan: true, beruvchi: null, mavzu: host }));
    socket.on('timeout', () => {
      socket.destroy();
      resolve({ mavjud: false, amalQilishMuddati: null, muddatiTugagan: true, beruvchi: null, mavzu: host });
    });
  });
}
