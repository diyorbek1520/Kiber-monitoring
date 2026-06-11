const REQUIRED_HEADERS = [
  'content-security-policy',
  'x-frame-options',
  'strict-transport-security',
  'x-content-type-options',
  'referrer-policy'
];

export async function scanHeaders(url) {
  try {
    const response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(9000) });
    const headers = REQUIRED_HEADERS.map((name) => ({
      nomi: displayHeaderName(name),
      mavjud: response.headers.has(name),
      qiymat: response.headers.get(name)
    }));

    return {
      https: {
        ishlayapti: response.url.startsWith('https://'),
        hsts: response.headers.has('strict-transport-security')
      },
      headers
    };
  } catch {
    return {
      https: { ishlayapti: false, hsts: false },
      headers: REQUIRED_HEADERS.map((name) => ({ nomi: displayHeaderName(name), mavjud: false, qiymat: null }))
    };
  }
}

function displayHeaderName(name) {
  const names = {
    'content-security-policy': 'Content-Security-Policy',
    'x-frame-options': 'X-Frame-Options',
    'strict-transport-security': 'Strict-Transport-Security',
    'x-content-type-options': 'X-Content-Type-Options',
    'referrer-policy': 'Referrer-Policy'
  };

  return names[name];
}
