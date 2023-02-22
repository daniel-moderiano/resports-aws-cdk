import * as dotenv from "dotenv";
dotenv.config();

export const databaseConfig = {
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: 5432,
};
