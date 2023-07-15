import {
  addSavedChannel,
  createErrorHttpResponse,
  createSuccessHttpResponse,
  handleDbConnection,
} from "@/helpers";
import { ChannelStruct } from "@/types";
import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { is, object, string } from "superstruct";

const SavedChannelRequestStruct = object({
  userId: string(),
  channel: ChannelStruct,
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

  const updatedUser = await addSavedChannel(
    requestBody.userId,
    requestBody.channel
  );

  if (updatedUser) {
    return createSuccessHttpResponse(201, updatedUser);
  } else {
    return createErrorHttpResponse(500, "Failed to save channel");
  }
};
