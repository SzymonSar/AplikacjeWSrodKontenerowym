const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Połączenie z bazą danych (używamy nazwy serwisu z docker-compose jako hosta)
const pool = new Pool({
  user: 'user', host: 'db', database: 'notes_db', password: 'pass', port: 5432,
});

// Inicjalizacja tabeli
pool.query('CREATE TABLE IF NOT EXISTS notes (id SERIAL PRIMARY KEY, content TEXT)');

app.get('/notes', async (req, res) => {
  const result = await pool.query('SELECT * FROM notes');
  res.json(result.rows);
});

app.post('/notes', async (req, res) => {
  const { content } = req.body;
  if (content) {
    await pool.query('INSERT INTO notes (content) VALUES ($1)', [content]);
    res.status(201).send();
  } else {
    res.status(400).send();
  }
});

app.listen(3000, () => console.log('Backend runs on port 3000'));