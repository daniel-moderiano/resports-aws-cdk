import { Handler, APIGatewayProxyEventV2 } from "aws-lambda";
import { Client } from "pg";
import { env } from "../config/database";
import { createNewTables, dropExistingTables } from "../helpers/initdb";

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  try {
    const client = new Client({
      user: env.DATABASE_USER,
      host: env.DATABASE_HOST,
      database: env.DATABASE_NAME,
      password: env.DATABASE_PASSWORD,
      port: 5432,
    });
    await client.connect();

    await dropExistingTables(client);
    await createNewTables(client);
    const res = await client.query(
      "SELECT * FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'"
    );

    await client.end();

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain" },
      body: res.rows,
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
