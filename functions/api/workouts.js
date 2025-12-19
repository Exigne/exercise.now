export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const userEmail = url.searchParams.get('email');

  // HANDLE GET: Fetch workouts for a specific user
  if (request.method === "GET") {
    if (!userEmail) return new Response("Email required", { status: 400 });
    
    const { results } = await env.DB.prepare(
      "SELECT * FROM workouts WHERE user_email = ? ORDER BY id DESC"
    ).bind(userEmail).all();
    
    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    });
  }

  // HANDLE POST: Save a new workout
  if (request.method === "POST") {
    const data = await request.json();
    
    await env.DB.prepare(
      `INSERT INTO workouts (user_email, exercise, category, sets, reps, weight, duration, distance, intensity) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      data.user_email, data.exercise, data.category, 
      data.sets, data.reps, data.weight, 
      data.duration, data.distance, data.intensity
    ).run();

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  }

  // HANDLE DELETE: Remove a workout
  if (request.method === "DELETE") {
    const { id } = await request.json();
    await env.DB.prepare("DELETE FROM workouts WHERE id = ?").bind(id).run();
    return new Response(JSON.stringify({ success: true }));
  }
}
