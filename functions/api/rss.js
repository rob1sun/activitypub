export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('target');

  if (!targetUrl) return new Response("Missing target", { status: 400 });

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'ActivityReader/1.0 (RSS Reader)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      }
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    // Hämta som text (XML)
    const xml = await response.text();

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
