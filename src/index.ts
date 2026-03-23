import express = require('express');
import dotenv = require('dotenv');
import pool = require('./config/db');

dotenv.config();

const app = express();
app.use(express.json());

const port = Number.parseInt(process.env.PORT ?? '3000', 10);

app.get('/health', async (_req, res) => {
  const result = await pool.query('SELECT NOW()');
  res.json({
    status: 'OK',
    time: result.rows[0],
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
