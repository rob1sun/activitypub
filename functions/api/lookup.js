export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // Hämta mål-adressen från query-parametern
  const targetUrl = url.searchParams.get('target');

  if (!targetUrl) {
    return new Response(JSON.stringify({ error: "Ingen URL angiven" }), { status: 400 });
  }

  // Validera att det är en http/https länk för säkerhet
  if (!targetUrl.startsWith('http')) {
      return new Response(JSON.stringify({ error: "Ogiltigt protokoll" }), { status: 400 });
  }

  try {
    // ActivityPub-servrar kräver specifika headers
    const response = await fetch(targetUrl, {
      headers: {
        'Accept': 'application/activity+json, application/ld+json; profile="https://www.w3.org/ns/activitystreams", application/json',
        'User-Agent': 'MinActivityPubLasare/1.0' // Vissa servrar blockerar requests utan User-Agent
      }
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: `Kunde inte hämta data: ${response.status}` }), { status: response.status });
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        // Tillåt frontend att läsa svaret
        'Access-Control-Allow-Origin': '*' 
      }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
