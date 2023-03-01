import { Handler } from "aws-lambda";
import { Client } from "pg";
import { databaseConfig } from "../config/database";

export const handler: Handler = async function () {
  try {
    const client = new Client({
      user: databaseConfig.DATABASE_USER,
      host: databaseConfig.DATABASE_HOST,
      database: databaseConfig.DATABASE_NAME,
      password: databaseConfig.DATABASE_PASSWORD,
      port: 5432,
    });
    await client.connect();

    const users = await client.query(
      `SELECT 
      table_name, 
      column_name, 
      data_type 
   FROM 
      information_schema.columns
   WHERE 
      table_name = 'users'`
    );

    console.log(users.rows);

    const channels = await client.query(
      `SELECT 
      table_name, 
      column_name, 
      data_type 
   FROM 
      information_schema.columns
   WHERE 
      table_name = 'channels'`
    );

    console.log(channels.rows);

    const savedChannels = await client.query(
      `SELECT 
      table_name, 
      column_name, 
      data_type 
   FROM 
      information_schema.columns
   WHERE 
      table_name = 'saved_channels'`
    );

    console.log(savedChannels.rows);

    await client.end();

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(users.rows),
    };
  } catch (err) {
    console.log(err);

    return {
      statusCode: 500,
      headers: { "Content-Type": "text/plain" },
      body: "Welp, something went wrong",
    };
  }
};
