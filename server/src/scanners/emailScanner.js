// DNS promises email xavfsizligi uchun MX, SPF, DMARC yozuvlarini tekshirishda ishlatiladi.
import dns from 'node:dns/promises';

export async function scanEmailSecurity(host) {
  const txt = await getTxt(host);
  const dmarc = await getTxt(`_dmarc.${host}`);
  const dkimSelectors = ['default', 'google', 'selector1', 'selector2', 'mail'];
  const dkim = [];

  for (const selector of dkimSelectors) {
    const records = await getTxt(`${selector}._domainkey.${host}`);
    if (records.some((record) => record.includes('v=DKIM1'))) {
      dkim.push(selector);
    }
  }

  return {
    spf: {
      mavjud: txt.some((record) => record.startsWith('v=spf1')),
      yozuvlar: txt.filter((record) => record.startsWith('v=spf1'))
    },
    dmarc: {
      mavjud: dmarc.some((record) => record.startsWith('v=DMARC1')),
      yozuvlar: dmarc.filter((record) => record.startsWith('v=DMARC1'))
    },
    dkim: {
      ehtimoliyMavjud: dkim.length > 0,
      topilganSelectorlar: dkim
    }
  };
}

async function getTxt(host) {
  try {
    const records = await dns.resolveTxt(host);
    return records.map((chunks) => chunks.join(''));
  } catch {
    return [];
  }
}
