export async function onRequest(context) {
  const days = context.env.MAX_DAYS || 7;
  return new Response(JSON.stringify({ maxDays: parseInt(days) }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
