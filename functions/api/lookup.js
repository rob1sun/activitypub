export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // Hämta 'target' parametern från din frontend (adressen vi ska läsa)
  const targetUrl = url.searchParams.get('target');

  if (!targetUrl) {
    return new Response(JSON.stringify({ error: "Ingen URL angiven" }), { status: 400 });
  }

  try {
    // ActivityPub kräver specifika headers för att svara med JSON
    const response = await fetch(targetUrl, {
      headers: {
        'Accept': 'application/activity+json, application/ld+json; profile="https://www.w3.org/ns/activitystreams"'
      }
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: `Kunde inte hämta data: ${response.status}` }), { status: response.status });
    }

    const data = await response.json();

    // Returnera datan till din frontend
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        // Eftersom funktionen ligger på samma domän som frontenden behövs oftast inte CORS,
        // men det är bra praxis om du vill vara säker.
        'Access-Control-Allow-Origin': '*' 
      }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}