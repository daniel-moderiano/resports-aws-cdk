import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { is } from "superstruct";
import { SavedChannelStruct } from "../types";
import { selectSavedChannelByUserAndChannel } from "@/helpers";
import { databaseClientConfig } from "@/config";
import { Client } from "pg";

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  const savedChannelInformation = event.queryStringParameters;

  if (!savedChannelInformation) {
    return JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        status: "fail",
        data: {
          savedChannel: "Channel and user data is required",
        },
      },
    });
  }

  if (!is(savedChannelInformation, SavedChannelStruct)) {
    return JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        status: "fail",
        data: {
          savedChannel: "Channel or user data is incorrectly formatted",
        },
      },
    });
  }

  const database = new Client({ ...databaseClientConfig });
  await database.connect();

  const result = await selectSavedChannelByUserAndChannel(
    database,
    savedChannelInformation.user_id,
    savedChannelInformation.channel_id
  );

  await database.end();

  return JSON.stringify({
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: {
      status: "success",
      data:
        result.rowCount === 0
          ? null
          : {
              savedChannel: result.rows[0],
            },
    },
  });
};
