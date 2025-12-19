export async function onRequest(context) {
  const { request, env } = context;
  
  // CORS Headers to allow the dashboard to communicate with the API
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // 1. Handle Preflight (Browser security check)
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  // 2. Handle GET (Fetching existing workouts)
  if (request.method === 'GET') {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    
    try {
      if (!email) {
        return Response.json({ error: "Email is required" }, { status: 400, headers });
      }

      // Query the D1 Database
      // Ensure your binding is named "DB" in the Cloudflare Dashboard
      const { results } = await env.DB.prepare(
        "SELECT * FROM workouts WHERE user_email = ? ORDER BY created_at DESC"
      ).bind(email).all();
      
      return Response.json(results, { headers });
    } catch (err) {
      console.error("GET Error:", err);
      return Response.json({ error: err.message }, { status: 500, headers });
    }
  }

  // 3. Handle POST (Saving new workout data)
  if (request.method === 'POST') {
    try {
      const workout = await request.json();

      // Validation
      if (!workout.user_email || !workout.exercise) {
        return Response.json({ error: "Missing required fields" }, { status: 400, headers });
      }

      // INSERT into D1 Database
      // This part processes the data so you no longer get the 405 error
      await env.DB.prepare(
        `INSERT INTO workouts (user_email, exercise, category, sets, reps, weight, intensity, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        workout.user_email, 
        workout.exercise, 
        workout.category || 'strength', 
        workout.sets || 0, 
        workout.reps || 0, 
        workout.weight || 0, 
        workout.intensity || 'medium',
        new Date().toISOString()
      ).run();

      return Response.json({ success: true }, { status: 201, headers });
      
    } catch (err) {
      console.error("POST Error:", err);
      return Response.json({ error: err.message }, { status: 500, headers });
    }
  }

  // 4. Handle DELETE (Removing a workout)
  if (request.method === 'DELETE') {
    try {
      const { id } = await request.json();
      await env.DB.prepare("DELETE FROM workouts WHERE id = ?").bind(id).run();
      return Response.json({ success: true }, { headers });
    } catch (err) {
      console.error("DELETE Error:", err);
      return Response.json({ error: err.message }, { status: 500, headers });
    }
  }

  // Default response for unsupported methods
  return Response.json({ error: "Method not allowed" }, { status: 405, headers });
}
