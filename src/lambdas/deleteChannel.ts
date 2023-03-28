import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { is, object, string } from "superstruct";
import { deleteChannel } from "@/helpers";
import { databaseClientConfig } from "@/config";
import { Client } from "pg";

const ChannelIdStruct = object({
  channel_id: string(),
});

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  const channelInformation = event.pathParameters;

  if (!channelInformation) {
    return JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        status: "fail",
        data: {
          user: "Channel ID is required",
        },
      },
    });
  }

  if (!is(channelInformation, ChannelIdStruct)) {
    return JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        status: "fail",
        data: {
          user: "Channel ID is incorrectly formatted",
        },
      },
    });
  }

  const database = new Client({ ...databaseClientConfig });
  await database.connect();

  await deleteChannel(database, channelInformation.channel_id);

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
