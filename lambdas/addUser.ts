import { Handler, APIGatewayProxyEventV2 } from "aws-lambda";
import { Client } from "pg";
import { is } from "superstruct";
import { databaseConfig } from "../config/database";
import { upsertUser } from "../helpers/databaseQueries";
import { UserStruct } from "../types";

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  if (!event.body) {
    return JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "Bad request. Missing user information.",
      },
    });
  }

  const userInformation = JSON.parse(event.body);

  if (!is(userInformation, UserStruct)) {
    return JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "Bad request. Invalid user information.",
      },
    });
  }

  const client = new Client({
    user: databaseConfig.DATABASE_USER,
    host: databaseConfig.DATABASE_HOST,
    database: databaseConfig.DATABASE_NAME,
    password: databaseConfig.DATABASE_PASSWORD,
    port: 5432,
  });

  // The following code will throw a generic 500 internal server error. We might consider a try/catch, but I don't think we would handle the error any differently
  await client.connect();

  await upsertUser(client, userInformation);

  await client.end();

  return JSON.stringify({
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: {
      message: "Channel added successfully",
    },
  });
};
