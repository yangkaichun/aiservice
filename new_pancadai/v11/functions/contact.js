/**
 * v11.2.25 聯絡表單 API — Cloudflare Pages Functions
 * POST /api/contact
 * 安全：Turnstile 人機驗證 → 欄位驗證/注入剝離 → GAS 轉發 → MailApp 寄信
 * 環境變數（wrangler secret put 或 Dashboard Pages→Settings→Secrets）：
 *   TURNSTILE_SECRET : Turnstile Secret Key
 *   GAS_URL          : Google Apps Script Web App URL
 */
export async function onRequestPost(context) {
  const { request, env } = context;

  // 1. 讀取 body
  let data;
  try { data = await request.json(); } catch (e) {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  // 2. Turnstile 伺服器端驗證（防機器人濫發）
  if (!env.TURNSTILE_SECRET) return json({ ok: false, error: 'server_misconfig' }, 500);
  if (!data.turnstile) return json({ ok: false, error: 'captcha_required' }, 400);
  const cf = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: env.TURNSTILE_SECRET,
      response: data.turnstile,
      remoteip: request.headers.get('CF-Connecting-IP') || ''
    })
  }).then(r => r.json()).catch(() => ({ success: false }));
  if (!cf.success) return json({ ok: false, error: 'captcha_failed' }, 403);

  // 3. 欄位驗證＋注入剝離
  const strip = s => s.replace(/<[^>]*>/g, '').replace(/[<>\\]/g, '').trim();
  const name = strip(String(data.name || '')).slice(0, 60);
  const email = strip(String(data.email || '')).slice(0, 120);
  const phone = strip(String(data.phone || '')).slice(0, 40);
  const type = strip(String(data.type || 'general')).slice(0, 40);
  const message = strip(String(data.message || '')).slice(0, 2000);
  const lang = strip(String(data.lang || 'zh')).slice(0, 8);
  if (!name || !message) return json({ ok: false, error: 'required' }, 400);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ ok: false, error: 'email' }, 400);

  // 4. 轉發 Google Apps Script（MailApp 寄送到 info@pancad.ai）
  if (!env.GAS_URL) return json({ ok: false, error: 'server_misconfig' }, 500);
  const gas = await fetch(env.GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, phone, type, message, lang })
  }).then(r => r.json()).catch(() => ({ ok: false }));
  if (!gas.ok) return json({ ok: false, error: 'send_failed' }, 502);

  return json({ ok: true });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}
