import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { is, object, string } from "superstruct";
import {
  createFailResponse,
  createSuccessResponse,
  getAllSavedChannelsForUser,
  handleDbConnection,
} from "@/helpers";

const UserIdStruct = object({
  user_id: string(),
});

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  const userInformation = event.pathParameters;

  if (!userInformation) {
    return createFailResponse(400, {
      user: "User ID is missing.",
    });
  }

  if (!is(userInformation, UserIdStruct)) {
    return createFailResponse(400, {
      user: "User ID is invalid.",
    });
  }

  const errorResponse = await handleDbConnection();
  if (errorResponse) return errorResponse;

  const savedChannels = await getAllSavedChannelsForUser(
    userInformation.user_id
  );

  if (savedChannels) {
    return createSuccessResponse(200, {
      savedChannels,
    });
  } else {
    return createFailResponse(500, {
      savedChannels: "Failed to retrieve saved channels.",
    });
  }
};
