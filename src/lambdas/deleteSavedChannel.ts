import {
  createErrorHttpResponse,
  createSuccessHttpResponse,
  deleteSavedChannel,
  handleDbConnection,
} from "@/helpers";
import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { is, object, string } from "superstruct";

const SavedChannelRequestStruct = object({
  userId: string(),
  channelId: string(),
});

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  if (!event.body) {
    return createErrorHttpResponse(400, "User and/or channel data is missing.");
  }

  const requestBody = JSON.parse(event.body);

  if (!is(requestBody, SavedChannelRequestStruct)) {
    return createErrorHttpResponse(400, "Incorrect user and/or channel data.");
  }

  const errorResponse = await handleDbConnection();
  if (errorResponse) return errorResponse;

  await deleteSavedChannel(requestBody.userId, requestBody.channelId);

  return createSuccessHttpResponse(204, null);
};
