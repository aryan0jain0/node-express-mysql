import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
const db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

try {
  // const connection = await pool.getConnection()
  await db.getConnection();
  console.log("database connection successful");
} catch (error) {
  console.error("database connection failed");
}

export default db;
