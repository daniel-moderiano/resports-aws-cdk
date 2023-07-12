import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { is, object, string } from "superstruct";
import {
  createFailResponse,
  createSuccessResponse,
  deleteChannel,
  handleDbConnection,
} from "@/helpers";

const ChannelIdStruct = object({
  channel_id: string(),
});

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  const channelInformation = event.pathParameters;

  if (!channelInformation) {
    return createFailResponse(400, {
      channel: "Channel ID is required",
    });
  }

  if (!is(channelInformation, ChannelIdStruct)) {
    return createFailResponse(400, {
      channel: "Channel ID is incorrectly formatted",
    });
  }

  const errorResponse = await handleDbConnection();
  if (errorResponse) return errorResponse;

  const deletedChannel = await deleteChannel(channelInformation.channel_id);

  if (deletedChannel) {
    return createSuccessResponse(204, null);
  } else {
    return createFailResponse(500, {
      channel: "Failed to delete channel",
    });
  }
};
