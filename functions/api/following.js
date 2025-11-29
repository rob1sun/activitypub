export async function onRequest(context) {
  const { request, env } = context;
  const kv = env.MIN_KV; // Kopplingen vi gjorde i inställningarna
  const KEY = "my_following_list";

  // Hämta nuvarande lista
  let list = await kv.get(KEY, { type: "json" }) || [];

  // 1. Om det är en GET-förfrågan -> Visa listan
  if (request.method === "GET") {
    return new Response(JSON.stringify(list), { headers: { "Content-Type": "application/json" } });
  }

  // 2. Om det är POST (Lägg till) eller DELETE (Ta bort)
  const body = await request.json(); // { url: "...", handle: "...", icon: "..." }
  
  if (request.method === "POST") {
    // Lägg till om den inte redan finns
    if (!list.find(u => u.url === body.url)) {
      list.push(body);
      await kv.put(KEY, JSON.stringify(list));
    }
    return new Response(JSON.stringify({ message: "Följer nu", list }));
  }

  if (request.method === "DELETE") {
    // Filtrera bort den vi vill ta bort
    list = list.filter(u => u.url !== body.url);
    await kv.put(KEY, JSON.stringify(list));
    return new Response(JSON.stringify({ message: "Avföljd", list }));
  }

  return new Response("Method not allowed", { status: 405 });
}
