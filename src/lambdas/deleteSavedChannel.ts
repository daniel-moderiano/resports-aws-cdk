import {
  createErrorHttpResponse,
  createSuccessHttpResponse,
  deleteSavedChannel,
  handleDbConnection,
} from "@/helpers";
import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { is, object, string } from "superstruct";

const PathParamsStruct = object({
  userId: string(),
  channelId: string(),
});

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  const pathParams = event.pathParameters;

  if (!pathParams) {
    return createErrorHttpResponse(400, "User and/or channel ID is missing.");
  }

  if (!is(pathParams, PathParamsStruct)) {
    return createErrorHttpResponse(
      400,
      "User and/or channel parameters are invalid"
    );
  }

  const errorResponse = await handleDbConnection();
  if (errorResponse) return errorResponse;

  await deleteSavedChannel(pathParams.userId, pathParams.channelId);

  return createSuccessHttpResponse(204, null);
};
