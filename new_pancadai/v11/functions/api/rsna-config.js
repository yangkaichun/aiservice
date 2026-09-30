export async function onRequestGet({env}) {
  const siteKey = env.TURNSTILE_SITE_KEY || '';
  return Response.json(
    {siteKey},
    {status: siteKey ? 200 : 503, headers: {'Cache-Control': 'no-store'}}
  );
}
