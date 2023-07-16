import { Handler, APIGatewayProxyEventV2 } from "aws-lambda";
import { is, omit } from "superstruct";
import { UserStruct } from "@/types";
import {
  createErrorHttpResponse,
  createSuccessHttpResponse,
  handleDbConnection,
  upsertUser,
} from "@/helpers";

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  if (!event.body) {
    return createErrorHttpResponse(400, "User data is required.");
  }

  const userInformation = JSON.parse(event.body);

  if (!is(userInformation, omit(UserStruct, ["saved_channels"]))) {
    return createErrorHttpResponse(400, "User data is invalid.");
  }

  const errorResponse = await handleDbConnection();
  if (errorResponse) return errorResponse;

  const upsertedUser = await upsertUser(userInformation);

  if (upsertedUser) {
    return createSuccessHttpResponse(200, upsertedUser);
  } else {
    return createErrorHttpResponse(500, "Failed to add user");
  }
};
