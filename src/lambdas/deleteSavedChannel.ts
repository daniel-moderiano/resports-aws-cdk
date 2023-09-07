import {
  createErrorHttpResponse,
  createSuccessHttpResponse,
  deleteSavedChannel,
  handleDbConnection,
} from "@/helpers";
import { getUserIdFromLambdaEvent } from "@/helpers/JwtDecoder";
import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { is, object, string } from "superstruct";

const ChannelIdStruct = object({
  channelId: string(),
});

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  const userId = getUserIdFromLambdaEvent(event);
  const pathParams = event.pathParameters;

  if (!pathParams) {
    return createErrorHttpResponse(400, "Channel ID is missing.");
  }

  if (!is(pathParams, ChannelIdStruct)) {
    return createErrorHttpResponse(400, "Channel ID is invalid");
  }

  const errorResponse = await handleDbConnection();
  if (errorResponse) return errorResponse;

  await deleteSavedChannel(userId, pathParams.channelId);

  return createSuccessHttpResponse(204, null);
};
