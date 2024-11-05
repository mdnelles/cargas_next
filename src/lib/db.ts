import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const pool = mysql.createPool({
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_NAME,
   waitForConnections: true,
   connectionLimit: 10,
   queueLimit: 0,
});

async function testConnection() {
   let connection: mysql.PoolConnection | undefined;
   try {
      connection = await pool.getConnection();
      console.log("Successfully connected to the database");
      const [rows] = await connection.query<mysql.RowDataPacket[]>(
         "SELECT NOW() as now"
      );
      console.log("Current time from database:", rows[0]?.now);
   } catch (err) {
      console.error("Error connecting to the database", err);
   } finally {
      if (connection) {
         connection.release();
      }
   }
}

testConnection();

export default pool;
