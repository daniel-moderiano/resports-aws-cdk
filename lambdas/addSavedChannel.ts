import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { is } from "superstruct";
import { ChannelStruct, SavedChannelStruct } from "../types";
import { insertChannel, insertSavedChannel } from "../helpers/databaseQueries";
import { Client } from "pg";
import { databaseConfig } from "../config/database";

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  if (!event.body) {
    return JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "Bad request. Missing channel and/or user information.",
      },
    });
  }

  const savedChannelInformation = JSON.parse(event.body);

  if (!is(savedChannelInformation, SavedChannelStruct)) {
    return JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "Bad request. Invalid channel and/or user information.",
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

  await insertSavedChannel(
    client,
    savedChannelInformation.user_id,
    savedChannelInformation.user_id
  );

  await client.end();

  return JSON.stringify({
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: {
      message: "Channel added successfully",
    },
  });
};
