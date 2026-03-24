import dotenv = require('dotenv');

dotenv.config();

import express = require('express');
import pool = require('./config/db');
import routes = require('./routes/routes');

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

app.use('/api/v1', routes.router);

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
