import { Sequelize } from "sequelize";
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

// Create a Sequelize instance using the pool
const sequelize = new Sequelize({
   dialect: "mysql",
   dialectModule: mysql,
   host: process.env.DB_HOST,
   port: Number(process.env.DB_PORT),
   username: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_NAME,
   pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
   },
});

export { sequelize, pool };
