import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { is } from "superstruct";
import { SavedChannelStruct } from "@/types";
import { insertSavedChannel } from "@/helpers";
import { databaseClientConfig } from "@/config";
import { Client } from "pg";

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

  const database = new Client({ ...databaseClientConfig });
  await database.connect();

  await insertSavedChannel(
    database,
    savedChannelInformation.user_id,
    savedChannelInformation.user_id
  );

  await database.end();

  return JSON.stringify({
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: {
      message: "Saved channel added successfully",
    },
  });
};
