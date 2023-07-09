import { Handler, APIGatewayProxyEventV2 } from "aws-lambda";
import { is } from "superstruct";
import { UserStruct } from "@/types";
import {
  createFailResponse,
  createSuccessResponse,
  handleDbConnection,
  upsertUser,
} from "@/helpers";

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  if (!event.body) {
    return createFailResponse(400, {
      user: "User data is required.",
    });
  }

  const userInformation = JSON.parse(event.body);

  if (!is(userInformation, UserStruct)) {
    return createFailResponse(400, {
      user: "User data is invalid.",
    });
  }

  const errorResponse = await handleDbConnection();
  if (errorResponse) return errorResponse;

  const upsertedUser = await upsertUser(userInformation);

  if (upsertedUser) {
    return createSuccessResponse(200, {
      user: upsertedUser,
    });
  } else {
    return createFailResponse(500, {
      user: "Error occurred while attempting to add user",
    });
  }
};
