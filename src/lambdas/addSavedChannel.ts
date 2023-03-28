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
        status: "fail",
        data: {
          savedChannel: "Channel and user data is required",
        },
      },
    });
  }

  const savedChannelInformation = JSON.parse(event.body);

  if (!is(savedChannelInformation, SavedChannelStruct)) {
    return JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        status: "fail",
        data: {
          savedChannel: "Incorrect channel or user data format",
        },
      },
    });
  }

  const database = new Client({ ...databaseClientConfig });
  await database.connect();

  await insertSavedChannel(
    database,
    savedChannelInformation.user_id,
    savedChannelInformation.channel_id
  );

  await database.end();

  return JSON.stringify({
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: {
      status: "success",
      data: null,
    },
  });
};
