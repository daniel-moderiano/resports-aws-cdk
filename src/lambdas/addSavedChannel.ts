import {
  addSavedChannelForUser,
  createFailResponse,
  createSuccessResponse,
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
    return createFailResponse(400, {
      savedChannel: "User and/or channel data is missing.",
    });
  }

  const requestBody = JSON.parse(event.body);

  if (!is(requestBody, SavedChannelRequestStruct)) {
    return createFailResponse(400, {
      savedChannel: "Incorrect user and/or channel data.",
    });
  }

  const errorResponse = await handleDbConnection();
  if (errorResponse) return errorResponse;

  const updatedUser = await addSavedChannelForUser(
    requestBody.userId,
    requestBody.channelId
  );

  if (updatedUser) {
    return createSuccessResponse(201, {
      user: updatedUser,
    });
  } else {
    return createFailResponse(500, {
      user: "Failed to save channel",
    });
  }
};
