const ROLES = new Set([
  'Radiologist', 'Gastroenterologist / hepatologist', 'Internal medicine physician',
  'Oncologist', 'Surgeon', 'Screening / preventive medicine physician',
  'Radiology or imaging department leader', 'Hospital / health system administrator',
  'Clinical researcher / academic', 'CT equipment manufacturer',
  'PACS / RIS / imaging software company', 'Medical AI / digital health company',
  'Distributor / channel partner', 'Investor / strategic partner', 'Other'
]);
const INTERESTS = new Set([
  'Learn about PANCREASaver', 'Product demo', 'Clinical evidence and research',
  'Business partnership / distribution', 'System integration (PACS / RIS / DICOM)',
  'Clinical / research collaboration', 'Investment / strategic partnership', 'Other'
]);
const DAYS = new Set(['', '2026-11-29', '2026-11-30', '2026-12-01', '2026-12-02']);
const TIMES = new Set(['', '10 a.m.–noon', 'Noon–2 p.m.', '2–5 p.m.']);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const reply = (body, status = 200) => Response.json(body, {
  status, headers: {'Cache-Control': 'no-store'}
});
const clean = (value, limit) =>
  typeof value === 'string' ? value.trim().replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, limit) : '';

export async function onRequestPost({request, env}) {
  if (!env.TURNSTILE_SECRET || !env.GAS_URL || !env.GAS_SHARED_SECRET)
    return reply({ok: false, error: 'Meeting form is not configured yet.'}, 503);
  if (!(request.headers.get('content-type') || '').includes('application/json'))
    return reply({ok: false, error: 'Invalid request format.'}, 415);
  const raw = await request.text();
  if (raw.length > 12000) return reply({ok: false, error: 'Request is too large.'}, 413);
  let data;
  try { data = JSON.parse(raw); } catch { return reply({ok: false, error: 'Invalid request.'}, 400); }
  if (clean(data.website, 100)) return reply({ok: true}); // honeypot
  const fields = {
    name: clean(data.name, 80), email: clean(data.email, 160),
    organization: clean(data.organization, 120), country: clean(data.country, 80),
    jobTitle: clean(data.jobTitle, 100), phone: clean(data.phone, 40),
    role: clean(data.role, 80), day: clean(data.day, 20),
    time: clean(data.time, 30), message: clean(data.message, 1500),
    otherDetails: clean(data.otherDetails, 160)
  };
  const interests = Array.isArray(data.interests) ? data.interests : [];
  if (!fields.name || !EMAIL.test(fields.email) || !fields.organization || !fields.country ||
      !ROLES.has(fields.role) || !interests.length || interests.length > INTERESTS.size ||
      !interests.every(i => typeof i === 'string' && INTERESTS.has(i)) ||
      ((fields.role === 'Other' || interests.includes('Other')) && !fields.otherDetails) ||
      !DAYS.has(fields.day) || !TIMES.has(fields.time) || data.consent !== true)
    return reply({ok: false, error: 'Please check the required fields.'}, 400);
  const token = clean(data.turnstileToken, 2048);
  if (!token) return reply({ok: false, error: 'Complete human verification.'}, 400);
  let verified;
  try {
    const form = new URLSearchParams({
      secret: env.TURNSTILE_SECRET, response: token,
      remoteip: request.headers.get('CF-Connecting-IP') || ''
    });
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', body: form
    });
    verified = await response.json();
  } catch {
    return reply({ok: false, error: 'Human verification is unavailable. Please try again.'}, 502);
  }
  if (!verified.success)
    return reply({ok: false, error: 'Human verification failed. Please try again.'}, 400);
  try {
    const response = await fetch(env.GAS_URL, {
      method: 'POST',
      headers: {'Content-Type': 'text/plain;charset=utf-8'},
      body: JSON.stringify({
        ...fields, interests: [...new Set(interests)], consent: true,
        sharedSecret: env.GAS_SHARED_SECRET, source: 'RSNA 2026 website'
      }),
      redirect: 'follow'
    });
    if (!response.ok) throw new Error('Mail relay error');
    const result = await response.json();
    if (!result.ok) throw new Error('Mail relay error');
  } catch {
    return reply({ok: false, error: 'We could not send the request. Please try again later.'}, 502);
  }
  return reply({ok: true});
}

export function onRequestGet() {
  return reply({ok: false, error: 'Method not allowed.'}, 405);
}
