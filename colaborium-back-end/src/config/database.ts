import { Pool } from "pg";

export const db = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 8080),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 10,
});

db.on("error", (error) => {
  console.error("Erro na conexão PostgreSQL:", error);
});