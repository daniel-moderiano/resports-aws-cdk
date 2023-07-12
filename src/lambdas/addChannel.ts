import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { is } from "superstruct";
import { ChannelStruct } from "@/types";
import {
  createFailResponse,
  createSuccessResponse,
  handleDbConnection,
  insertChannel,
} from "@/helpers";

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  if (!event.body) {
    return createFailResponse(400, {
      channel: "Channel data is required",
    });
  }

  const channelInformation = JSON.parse(event.body);

  if (!is(channelInformation, ChannelStruct)) {
    return createFailResponse(400, {
      channel: "Incorrect channel data format",
    });
  }

  const errorResponse = await handleDbConnection();
  if (errorResponse) return errorResponse;

  const insertedChannel = await insertChannel(channelInformation);

  if (insertedChannel) {
    return createSuccessResponse(200, {
      channel: insertedChannel,
    });
  } else {
    return createFailResponse(500, {
      channel: "Failed to add channel",
    });
  }
};
