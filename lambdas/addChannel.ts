import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { is } from "superstruct";
import { ChannelStruct } from "../types";
import { insertChannel } from "../helpers/databaseQueries";
import { database } from "../config/database";

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

  // The following code will throw a generic 500 internal server error. We might consider a try/catch, but I don't think we would handle the error any differently
  await database.connect();

  await insertChannel(database, requestBody);

  await database.end();

  return JSON.stringify({
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: {
      message: "Channel added successfully",
    },
  });
};
