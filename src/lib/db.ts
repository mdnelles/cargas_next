import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

// Create a pool of connections for handling multiple requests
const pool = mysql.createPool({
   host: process.env.DB_HOST,
   port: Number(process.env.DB_PORT),
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_NAME,
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

// NODE_OPTIONS='--loader ts-node/esm' node src/lib/db.ts
// testConnection();

export default pool;
