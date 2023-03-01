import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { is, object, string } from "superstruct";
import { deleteUser } from "../helpers/databaseQueries";
import { Client } from "pg";
import { databaseConfig } from "../config/database";
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

  const client = new Client({
    user: databaseConfig.DATABASE_USER,
    host: databaseConfig.DATABASE_HOST,
    database: databaseConfig.DATABASE_NAME,
    password: databaseConfig.DATABASE_PASSWORD,
    port: 5432,
  });

  // The following code will throw a generic 500 internal server error. We might consider a try/catch, but I don't think we would handle the error any differently
  await client.connect();

  const result = await deleteUser(client, userInformation.user_id);

  if (result.rowCount === 0) {
    await client.end();
    return JSON.stringify({
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "No existing user to delete",
      },
    });
  } else {
    await removeAllUserSavedChannels(client, userInformation.user_id);
    await client.end();
    return JSON.stringify({
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "All user data removed",
      },
    });
  }
};
