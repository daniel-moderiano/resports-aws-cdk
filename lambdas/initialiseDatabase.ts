import { Handler, APIGatewayProxyEventV2 } from "aws-lambda";
import { Client } from "pg";
import { env } from "../config/database";

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
    const res = await client.query("SELECT $1::text as message", [
      "Hello from the initialiser!",
    ]);
    console.log(res.rows[0].message); // Hello world!
    await client.end();

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain" },
      body: res.rows[0].message,
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
