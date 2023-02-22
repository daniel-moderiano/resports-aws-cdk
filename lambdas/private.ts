import { Handler, APIGatewayProxyEventV2 } from "aws-lambda";
const { Client } = require("pg").native;
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
      "Hello world!",
    ]);
    console.log(res.rows[0].message); // Hello world!
    await client.end();
  } catch (err) {
    console.log("error while trying to connect to db");
  }
};
