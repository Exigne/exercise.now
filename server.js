const express = require('express');
const { Pool } = require('pg');
const app = express();
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// GET Workouts
app.get('/api/workouts', async (req, res) => {
  const userEmail = req.query.user;
  const result = await pool.query('SELECT * FROM workouts WHERE user_email = $1', [userEmail]);
  res.json(result.rows); // This sends the JSON your dashboard expects!
});

app.listen(3000, () => console.log('Server running on port 3000'));
