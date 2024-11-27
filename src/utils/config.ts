import dotenv from 'dotenv'
import pkg from "pg";

const { Pool } = pkg;

dotenv.config();

export const PORT = process.env.PORT || 4000;

export const pool = new Pool({
  user: process.env.DB_USER || "",
  host: process.env.DB_HOST || "",
  database: process.env.DB_NAME || "",
  password: process.env.DB_PASSWORD || "",
  port: parseInt(process.env.DB_PORT || '5432'),
});
