import {
  addSavedChannel,
  createErrorHttpResponse,
  createSuccessHttpResponse,
  handleDbConnection,
} from "@/helpers";
import { getUserIdFromLambdaEvent } from "@/helpers/JwtDecoder";
import { ChannelStruct } from "@/types";
import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { is, object } from "superstruct";

const SavedChannelRequestStruct = object({
  channel: ChannelStruct,
});

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  const userId = getUserIdFromLambdaEvent(event);

  if (!event.body) {
    return createErrorHttpResponse(400, "Channel data is missing.");
  }

  const requestBody = JSON.parse(event.body);

  if (!is(requestBody, SavedChannelRequestStruct)) {
    return createErrorHttpResponse(400, "Invalid channel data.");
  }

  const errorResponse = await handleDbConnection();
  if (errorResponse) return errorResponse;

  const updatedUser = await addSavedChannel(userId, requestBody.channel);

  if (updatedUser) {
    return createSuccessHttpResponse(201, updatedUser);
  } else {
    return createErrorHttpResponse(500, "Failed to save channel");
  }
};
