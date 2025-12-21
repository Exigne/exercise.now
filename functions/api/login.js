// functions/api/login.js
export async function onRequestPost(context) {
  const { DB } = context.env;
  
  try {
    const { email, password } = await context.request.json();

    // Validate input
    if (!email || !password) {
      return Response.json(
        { message: 'Email and password required' },
        { status: 400 }
      );
    }

    // Query user from D1 database
    const user = await DB.prepare(
      'SELECT * FROM users WHERE email = ? AND password = ?'
    )
      .bind(email, password)
      .first();

    if (!user) {
      return Response.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Return user data (excluding password for security)
    return Response.json({
      id: user.id,
      email: user.email,
      name: user.name || email
    });

  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
