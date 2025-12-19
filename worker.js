export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    try {
      // POST: Save workout
      if (request.method === "POST") {
        const data = await request.json();
        await env.DB.prepare(
          "INSERT INTO workouts (user_email, exercise, category, sets, reps, weight, intensity) VALUES (?, ?, ?, ?, ?, ?, ?)"
        ).bind(data.user_email, data.exercise, data.category, data.sets, data.reps, data.weight, data.intensity).run();
        return new Response("OK", { headers: corsHeaders });
      }

      // GET: Fetch workouts
      if (request.method === "GET") {
        const email = url.searchParams.get("email");
        const { results } = await env.DB.prepare("SELECT * FROM workouts WHERE user_email = ?").bind(email).all();
        return Response.json(results, { headers: corsHeaders });
      }
    } catch (e) {
      return new Response(e.message, { status: 500, headers: corsHeaders });
    }
  }
};
