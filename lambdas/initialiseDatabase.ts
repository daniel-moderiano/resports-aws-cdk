import { Handler } from "aws-lambda";
import { Client } from "pg";
import { databaseConfig } from "../config/database";
import { createNewTables, dropExistingTables } from "../helpers/initdb";

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

    await dropExistingTables(client);
    await createNewTables(client);

    await client.end();

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain" },
      body: "Database initialised",
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
