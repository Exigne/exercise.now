// functions/api/workouts.js

// GET - Fetch workout history for a user
export async function onRequestGet(context) {
  const { DB } = context.env;
  const url = new URL(context.request.url);
  const userEmail = url.searchParams.get('user');

  if (!userEmail) {
    return Response.json(
      { message: 'User email required' },
      { status: 400 }
    );
  }

  try {
    const { results } = await DB.prepare(
      'SELECT * FROM workouts WHERE user_email = ? ORDER BY created_at DESC LIMIT 50'
    )
      .bind(userEmail)
      .all();

    return Response.json(results || []);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return Response.json(
      { message: 'Failed to fetch workouts', error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new workout
export async function onRequestPost(context) {
  const { DB } = context.env;

  try {
    const { user_email, exercise, sets, reps, weight } = await context.request.json();

    // Validate input
    if (!user_email || !exercise || !sets || !reps || !weight) {
      return Response.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Insert workout
    const result = await DB.prepare(
      'INSERT INTO workouts (user_email, exercise, sets, reps, weight, created_at) VALUES (?, ?, ?, ?, ?, datetime("now"))'
    )
      .bind(user_email, exercise, sets, reps, weight)
      .run();

    if (!result.success) {
      throw new Error('Failed to insert workout');
    }

    return Response.json(
      { message: 'Workout logged successfully', id: result.meta.last_row_id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error logging workout:', error);
    return Response.json(
      { message: 'Failed to log workout', error: error.message },
      { status: 500 }
    );
  }
}
