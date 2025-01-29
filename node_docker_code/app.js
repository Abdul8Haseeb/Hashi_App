const express = require('express');
const { Pool } = require('pg');  // PostgreSQL client
const app = express();

// Set up PostgreSQL connection
const pool = new Pool({
  user: 'your_user',      // replace with your postgres username
  host: 'your_host',      // replace with your PostgreSQL host
  database: 'your_db',    // replace with your database name
  password: 'your_password', // replace with your password
  port: 5432,
});

app.set('view engine', 'ejs');  // Set EJS as the templating engine
app.use(express.urlencoded({ extended: true }));  // Parse form data

// Home route to display data
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users'); // Fetch all users
    res.render('index', { users: result.rows });  // Render data in the view
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching data');
  }
});

// Route to handle data insertion
app.post('/add', async (req, res) => {
  const { name, email } = req.body; // Get form data
  try {
    await pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email]);
    res.redirect('/');  // Redirect back to the home page to see the updated list
  } catch (err) {
    console.error(err);
    res.status(500).send('Error inserting data');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

