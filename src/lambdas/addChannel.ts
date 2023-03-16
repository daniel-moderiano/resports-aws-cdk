import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { is } from "superstruct";
import { ChannelStruct } from "@/types";
import { insertChannel } from "@/helpers";
import { databaseClientConfig } from "@/config";
import { Client } from "pg";

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

  const channelInformation = JSON.parse(event.body);

  if (!is(channelInformation, ChannelStruct)) {
    return JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "Bad request. Invalid channel information.",
      },
    });
  }

  const database = new Client({ ...databaseClientConfig });
  await database.connect();

  await insertChannel(database, channelInformation);

  await database.end();

  return JSON.stringify({
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: {
      message: "Channel added successfully",
    },
  });
};
