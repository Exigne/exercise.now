export async function onRequest(context) {
  const { request, env } = context;
  
  // ✅ CRITICAL: Add CORS headers for POST requests
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // ✅ Handle OPTIONS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  console.log("📡 API Request:", request.method, request.url);

  if (request.method === 'GET') {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    console.log("📧 GET request for:", email);
    
    try {
      if (env.DB) {
        const { results } = await env.DB.prepare(
          'SELECT * FROM workouts WHERE user_email = ? ORDER BY created_at DESC'
        ).bind(email).all();
        return Response.json(results || []);
      } else if (env.WORKOUTS_KV) {
        const data = await env.WORKOUTS_KV.get(`workouts_${email}`);
        return Response.json(data ? JSON.parse(data) : []);
      }
      return Response.json([]);
    } catch (err) {
      console.error("GET Error:", err);
      return Response.json({ error: err.message }, { status: 500, headers });
    }
  }

  if (request.method === 'POST') {
    try {
      console.log("📥 POST request received");
      const workout = await request.json();
      console.log("📊 Workout data:", workout);

      // Validate required fields
      if (!workout.user_email || !workout.exercise) {
        return Response.json({ error: "Missing required fields" }, { status: 400, headers });
      }

      const workoutWithTimestamp = {
        ...workout,
        id: Date.now(),
        created_at: new Date().toISOString()
      };

      if (env.DB) {
        const { results } = await env.DB.prepare(
          'INSERT INTO workouts (user_email, exercise, category, sets, reps, weight, duration, distance, intensity, date, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *'
        ).bind(
          workout.user_email,
          workout.exercise,
          workout.category,
          workout.sets || null,
          workout.reps || null,
          workout.weight || null,
          workout.duration || null,
          workout.distance || null,
          workout.intensity || 'medium',
          workout.date || new Date().toISOString().split('T')[0],
          workoutWithTimestamp.created_at
        ).all();
        
        console.log("✅ Saved to DB:", results[0]);
        return Response.json(results[0]);
      }
      
      return Response.json(workoutWithTimestamp);
    } catch (err) {
      console.error("POST Error:", err);
      return Response.json({ error: err.message }, { status: 500, headers });
    }
  }

  return Response.json({ error: "Method not allowed" }, { status: 405, headers });
}
