export async function onRequest(context) {
  const { request, env } = context;
  
  // Add CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle OPTIONS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  if (request.method === 'GET') {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    
    if (!email) {
      return new Response(JSON.stringify([]), { headers });
    }

    try {
      // Try D1 first, fallback to KV
      if (env.DB) {
        const { results } = await env.DB.prepare(
          'SELECT * FROM workouts WHERE user_email = ? ORDER BY created_at DESC'
        ).bind(email).all();
        return Response.json(results);
      } else if (env.WORKOUTS_KV) {
        const data = await env.WORKOUTS_KV.get(`workouts_${email}`);
        return Response.json(data ? JSON.parse(data) : []);
      } else {
        // Fallback - return empty array
        return Response.json([]);
      }
    } catch (err) {
      console.error("GET Error:", err);
      return Response.json([]);
    }
  }

  if (request.method === 'POST') {
    try {
      const workout = await request.json();
      console.log("📥 Received workout:", workout);
      
      if (!workout.user_email || !workout.exercise) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), { 
          status: 400, 
          headers 
        });
      }

      // Add timestamp
      const workoutWithTimestamp = {
        ...workout,
        id: Date.now(),
        created_at: new Date().toISOString()
      };

      // Try D1 first
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
        
        return Response.json(results[0]);
      } else if (env.WORKOUTS_KV) {
        // KV storage fallback
        const existing = await env.WORKOUTS_KV.get(`workouts_${workout.user_email}`);
        const
