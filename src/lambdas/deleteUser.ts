import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { is, object, string } from "superstruct";
import {
  createFailResponse,
  createSuccessResponse,
  deleteUser,
  handleDbConnection,
  removeOrphanChannel,
} from "@/helpers";

const UserIdStruct = object({
  user_id: string(),
});

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  const userInformation = event.pathParameters;

  if (!userInformation) {
    return createFailResponse(400, {
      user: "User ID is required.",
    });
  }

  if (!is(userInformation, UserIdStruct)) {
    return createFailResponse(400, {
      user: "User ID is invalid.",
    });
  }

  const errorResponse = await handleDbConnection();
  if (errorResponse) return errorResponse;

  const deletedUser = await deleteUser(userInformation.user_id);

  if (!deletedUser) {
    return createFailResponse(500, {
      user: "Error occurred while attempting to delete user",
    });
  }

  // user deleted - remove any orphan channels associated with deleted user
  await Promise.all(
    deletedUser.saved_channels.map((channel) => removeOrphanChannel(channel))
  );

  return createSuccessResponse(204, {
    user: deletedUser,
  });
};
