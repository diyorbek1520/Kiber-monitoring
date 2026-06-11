// DNS promises domenning DNS yozuvlarini olish uchun ishlatiladi.
import dns from 'node:dns/promises';

export async function scanDNS(host) {
  return {
    a: await safeResolve(() => dns.resolve4(host)),
    mx: await safeResolve(() => dns.resolveMx(host)),
    ns: await safeResolve(() => dns.resolveNs(host))
  };
}

async function safeResolve(resolver) {
  try {
    return await resolver();
  } catch {
    return [];
  }
}
