import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { is } from "superstruct";
import { ChannelStruct } from "../types";
import { insertChannel } from "../helpers/databaseQueries";
import { Client } from "pg";
import { databaseConfig } from "../config/database";

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  if (!event.body) {
    return JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "Bad request. Missing request body.",
      },
    });
  }

  const requestBody = JSON.parse(event.body);

  if (!is(requestBody, ChannelStruct)) {
    return JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "Bad request. Invalid channel information.",
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

  await insertChannel(client, requestBody);

  await client.end();

  return JSON.stringify({
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: {
      message: "Channel added successfully",
    },
  });
};
