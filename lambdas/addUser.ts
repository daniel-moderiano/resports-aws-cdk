import { Handler, APIGatewayProxyEventV2 } from "aws-lambda";
import { is } from "superstruct";
import { database } from "../config/database";
import { upsertUser } from "../helpers/databaseQueries";
import { UserStruct } from "../types";

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  if (!event.body) {
    return JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "Bad request. Missing user information.",
      },
    });
  }

  const userInformation = JSON.parse(event.body);

  if (!is(userInformation, UserStruct)) {
    return JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "Bad request. Invalid user information.",
      },
    });
  }

  await database.connect();

  await upsertUser(database, userInformation);

  await database.end();

  return JSON.stringify({
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: {
      message: "User added successfully",
    },
  });
};
