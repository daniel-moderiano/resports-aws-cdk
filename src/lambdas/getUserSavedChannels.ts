import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import {
  createErrorHttpResponse,
  createSuccessHttpResponse,
  getSavedChannels,
  handleDbConnection,
} from "@/helpers";
import { getUserIdFromLambdaEvent } from "@/helpers/JwtDecoder";

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  const userId = getUserIdFromLambdaEvent(event);

  const errorResponse = await handleDbConnection();
  if (errorResponse) return errorResponse;

  const savedChannels = await getSavedChannels(userId);

  if (savedChannels) {
    return createSuccessHttpResponse(200, savedChannels);
  } else {
    return createErrorHttpResponse(500, "Failed to retrieve saved channels.");
  }
};
