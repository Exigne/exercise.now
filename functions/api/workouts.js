export async function onRequest(context) {
  const { env, request } = context;
  const url = new URL(request.url);

  // common headers
  const headers = { 'Content-Type': 'application/json' };

  // CORS pre-flight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  /* ---------- GET /api/workouts?user=email ---------- */
  if (request.method === 'GET') {
    const user = url.searchParams.get('user');
    if (!user) return new Response('Missing ?user=', { status: 400, headers });

    const { results } = await env.DB.prepare(
      'SELECT * FROM workouts WHERE user_email = ? ORDER BY created_at DESC LIMIT 100'
    )
      .bind(user)
      .all();

    return Response.json(results, { headers });
  }

  /* ---------- POST /api/workouts ---------- */
  if (request.method === 'POST') {
    const body = await request.json();

    // basic validation
    if (!body.user_email || !body.exercise || !body.sets || !body.reps || !body.weight) {
      return new Response('Missing fields', { status: 400, headers });
    }

    await env.DB.prepare(
      'INSERT INTO workouts (user_email, exercise, sets, reps, weight) VALUES (?, ?, ?, ?, ?)'
    )
      .bind(body.user_email, body.exercise, body.sets, body.reps, body.weight)
      .run();

    return Response.json({ ok: true }, { headers });
  }

  return new Response('Method Not Allowed', { status: 405, headers });
}
