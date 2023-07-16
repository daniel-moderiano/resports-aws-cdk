import {
  addSavedChannel,
  createErrorHttpResponse,
  createSuccessHttpResponse,
  handleDbConnection,
} from "@/helpers";
import { ChannelStruct } from "@/types";
import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { is, object, string } from "superstruct";

const UserIdStruct = object({
  userId: string(),
});

const SavedChannelRequestStruct = object({
  channel: ChannelStruct,
});

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  const pathParams = event.pathParameters;

  if (!pathParams) {
    return createErrorHttpResponse(400, "User ID is missing.");
  }

  if (!is(pathParams, UserIdStruct)) {
    return createErrorHttpResponse(400, "User ID is invalid.");
  }

  if (!event.body) {
    return createErrorHttpResponse(400, "Channel data is missing.");
  }

  const requestBody = JSON.parse(event.body);

  if (!is(requestBody, SavedChannelRequestStruct)) {
    return createErrorHttpResponse(400, "Invalid channel data.");
  }

  const errorResponse = await handleDbConnection();
  if (errorResponse) return errorResponse;

  const updatedUser = await addSavedChannel(
    pathParams.userId,
    requestBody.channel
  );

  if (updatedUser) {
    return createSuccessHttpResponse(201, updatedUser);
  } else {
    return createErrorHttpResponse(500, "Failed to save channel");
  }
};
