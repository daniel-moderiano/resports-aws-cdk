import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { is, object, string } from "superstruct";
import { deleteChannel } from "@/helpers";
import { database } from "@/config";

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
        message: "Bad request. Missing channel ID.",
      },
    });
  }

  if (!is(channelInformation, ChannelIdStruct)) {
    return JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "Bad request. Invalid channel ID.",
      },
    });
  }

  await database.connect();

  const result = await deleteChannel(database, channelInformation.channel_id);

  await database.end();

  return JSON.stringify({
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: {
      message:
        result.rowCount === 0
          ? "No existing channel to delete"
          : `Channel ${channelInformation.channel_id} deleted.`,
    },
  });
};
