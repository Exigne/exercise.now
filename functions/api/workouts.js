export async function onRequest(context) {
  const { request, env } = context;
  
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // 1. Handle CORS Preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  // 2. Handle GET (Fetching workouts)
  if (request.method === 'GET') {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    try {
      if (!email) return Response.json({ error: "Email required" }, { status: 400, headers });
      const { results } = await env.DB.prepare("SELECT * FROM workouts WHERE user_email = ? ORDER BY created_at DESC").bind(email).all();
      return Response.json(results, { headers });
    } catch (err) {
      return Response.json({ error: err.message }, { status: 500, headers });
    }
  }

  // 3. Handle POST (Saving workouts) - THIS FIXES THE 405 ERROR
  if (request.method === 'POST') {
    try {
      const workout = await request.json();
      await env.DB.prepare(
        `INSERT INTO workouts (user_email, exercise, category, sets, reps, weight, intensity, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        workout.user_email, workout.exercise, workout.category || 'strength', 
        workout.sets || 0, workout.reps || 0, workout.weight || 0, 
        workout.intensity || 'medium', new Date().toISOString()
      ).run();
      return Response.json({ success: true }, { status: 201, headers });
    } catch (err) {
      return Response.json({ error: err.message }, { status: 500, headers });
    }
  }

  return Response.json({ error: "Method not allowed" }, { status: 405, headers });
}
