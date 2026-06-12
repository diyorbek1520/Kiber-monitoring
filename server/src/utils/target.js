// DNS promises domenlarni IP manzilga yechish va mavjudligini tekshirish uchun ishlatiladi.
import dns from 'node:dns/promises';

// Net moduli IP manzil formatini tekshirish uchun ishlatiladi.
import net from 'node:net';

// Validator URL va domen qiymatlarini ishonchli tekshirish uchun ishlatiladi.
import validator from 'validator';

const wildcardRedirectIps = new Set((process.env.DNS_WILDCARD_IPS || '185.183.243.161')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean));

export function normalizeTarget(value) {
  if (!value || typeof value !== 'string') {
    const error = new Error('Manzil kiritilishi shart');
    error.status = 400;
    error.publicMessage = 'Domen, URL yoki IP manzil kiriting';
    throw error;
  }

  const raw = value.trim();
  const isIp = net.isIP(raw) !== 0;
  const candidate = raw.includes('://') ? raw : `https://${raw}`;

  if (isIp) {
    return { raw, host: raw, url: `https://${raw}`, isIp: true };
  }

  if (!validator.isURL(candidate, { require_protocol: true, allow_underscores: false })) {
    const error = new Error('Manzil formati noto‘g‘ri');
    error.status = 400;
    error.publicMessage = 'To‘g‘ri domen, URL yoki IP manzil kiriting';
    throw error;
  }

  const parsed = new URL(candidate);
  return {
    raw,
    host: parsed.hostname,
    url: parsed.toString(),
    isIp: net.isIP(parsed.hostname) !== 0
  };
}

export async function resolveHost(host) {
  if (net.isIP(host)) return [host];

  try {
    const addresses = await dns.lookup(host, { all: true });
    const resolved = addresses.map((item) => item.address);

    if (await isWildcardRedirect(host, resolved)) {
      return [];
    }

    return resolved;
  } catch (error) {
    if (['ENOTFOUND', 'ENODATA'].includes(error.code)) return [];
    return null;
  }
}

async function isWildcardRedirect(host, resolved) {
  if (!resolved.length || resolved.some((address) => !wildcardRedirectIps.has(address))) {
    return false;
  }

  const probeHost = `audit-check-${Date.now()}-${Math.round(Math.random() * 100000)}.${host}`;

  try {
    const probeAddresses = await dns.lookup(probeHost, { all: true });
    const probeResolved = probeAddresses.map((item) => item.address);
    return sameAddressSet(resolved, probeResolved);
  } catch {
    return false;
  }
}

function sameAddressSet(left, right) {
  if (left.length !== right.length) return false;
  const leftSet = new Set(left);
  return right.every((item) => leftSet.has(item));
}
