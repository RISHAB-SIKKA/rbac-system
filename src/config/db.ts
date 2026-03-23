import pg = require('pg');
import dotenv = require('dotenv');

dotenv.config();

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number.parseInt(process.env.DB_PORT ?? '5432', 10),
});

void pool
  .connect()
  .then((client: pg.PoolClient) => {
    client.release();
    console.log('✅ DB Connected');
  })
  .catch((err: unknown) => console.error('❌ DB Connection Error', err));

export = pool;
