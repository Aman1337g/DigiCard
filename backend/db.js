import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default client;
