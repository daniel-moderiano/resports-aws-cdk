import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { is, object, string } from "superstruct";
import {
  createErrorHttpResponse,
  createSuccessHttpResponse,
  getSavedChannels,
  handleDbConnection,
} from "@/helpers";

const UserIdStruct = object({
  user_id: string(),
});

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  const userInformation = event.pathParameters;

  if (!userInformation) {
    return createErrorHttpResponse(400, "User ID is missing.");
  }

  if (!is(userInformation, UserIdStruct)) {
    return createErrorHttpResponse(400, "User ID is invalid.");
  }

  const errorResponse = await handleDbConnection();
  if (errorResponse) return errorResponse;

  const savedChannels = await getSavedChannels(userInformation.user_id);

  if (savedChannels) {
    return createSuccessHttpResponse(200, savedChannels);
  } else {
    return createErrorHttpResponse(500, "Failed to retrieve saved channels.");
  }
};
