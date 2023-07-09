import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { is, object, string } from "superstruct";
import { databaseClientConfig } from "@/config";
import { Client } from "pg";

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
        status: "fail",
        data: {
          savedChannels: "User ID is required",
        },
      },
    });
  }

  if (!is(userInformation, UserIdStruct)) {
    return JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        status: "fail",
        data: {
          savedChannels: "User ID is invalid",
        },
      },
    });
  }

  const database = new Client({ ...databaseClientConfig });
  await database.connect();

  // TODO: use new helper
  return;

  // const result = await selectSavedChannelsByUserId(
  //   database,
  //   userInformation.user_id
  // );

  // await database.end();

  // return JSON.stringify({
  //   statusCode: 200,
  //   headers: { "Content-Type": "application/json" },
  //   body: {
  //     status: "success",
  //     data: {
  //       savedChannels: result.rows,
  //     },
  //   },
  // });
};
