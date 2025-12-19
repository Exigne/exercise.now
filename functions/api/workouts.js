export async function onRequest(context) {
  const { request, env } = context;
  
  console.log("📡 API Request:", request.method, request.url);
  
  // Handle CORS
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  if (request.method === 'GET') {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    console.log("📧 GET request for:", email);
    
    try {
      // For now, just return empty array to test
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

      // Simple validation
      if (!workout.user_email || !workout.exercise) {
        return Response.json({ error: "Missing required fields" }, { status: 400, headers });
      }

      // For now, just return the workout back (testing)
      const result = {
        ...workout,
        id: Date.now(),
        created_at: new Date().toISOString()
      };
      
      console.log("✅ Returning:", result);
      return Response.json(result, { headers });
      
    } catch (err) {
      console.error("POST Error:", err);
      return Response.json({ error: err.message }, { status: 500, headers });
    }
  }

  return Response.json({ error: "Method not allowed" }, { status: 405, headers });
}
