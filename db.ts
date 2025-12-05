import mysql from "mysql2/promise"

// Connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "admin_panel",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export async function query({ sql, values = [] }: { sql: string; values?: any[] }) {
  const [rows] = await pool.execute(sql, values)
  return rows
}
