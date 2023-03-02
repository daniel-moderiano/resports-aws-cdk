import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { is, object, string } from "superstruct";
import { deleteUser } from "../helpers/databaseQueries";
import { database } from "../config/database";
import { removeAllUserSavedChannels } from "../helpers/databaseQueries";

const UserIdStruct = object({
  user_id: string(),
});

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  const userInformation = event.pathParameters;

  if (!userInformation) {
    return JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "Bad request. Missing user ID.",
      },
    });
  }

  if (!is(userInformation, UserIdStruct)) {
    return JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "Bad request. Invalid user ID.",
      },
    });
  }

  await database.connect();

  await removeAllUserSavedChannels(database, userInformation.user_id);
  const result = await deleteUser(database, userInformation.user_id);

  await database.end();

  return JSON.stringify({
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: {
      message:
        result.rowCount === 0
          ? "No existing user to delete"
          : "All user data deleted",
    },
  });
};
