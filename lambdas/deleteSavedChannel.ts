import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { is } from "superstruct";
import { SavedChannelStruct } from "../types";
import { safelyRemoveSavedChannel } from "../helpers/databaseQueries";
import { database } from "../config/database";

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  const savedChannelInformation = event.queryStringParameters;

  if (!savedChannelInformation) {
    return JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "Bad request. Missing user and/or channel information.",
      },
    });
  }

  if (!is(savedChannelInformation, SavedChannelStruct)) {
    return JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "Bad request. Invalid user and/or channel information.",
      },
    });
  }

  await database.connect();

  const result = await safelyRemoveSavedChannel(
    database,
    savedChannelInformation.user_id,
    savedChannelInformation.channel_id
  );

  await database.end();

  return JSON.stringify({
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: {
      message:
        result.rowCount === 0
          ? "No existing channel to delete"
          : "Saved channel deleted",
    },
  });
};
