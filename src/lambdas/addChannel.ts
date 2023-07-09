import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { is } from "superstruct";
import { ChannelStruct } from "@/types";
import { databaseClientConfig } from "@/config";
import { Client } from "pg";

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  if (!event.body) {
    return JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        status: "fail",
        data: {
          channel: "Channel data is required",
        },
      },
    });
  }

  const channelInformation = JSON.parse(event.body);

  if (!is(channelInformation, ChannelStruct)) {
    return JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        status: "fail",
        data: {
          channel: "Incorrect channel data format",
        },
      },
    });
  }

  const database = new Client({ ...databaseClientConfig });
  await database.connect();

  // TODO: use new mongo helper
  return;

  // await insertChannel(database, channelInformation);

  // await database.end();

  // return JSON.stringify({
  //   statusCode: 200,
  //   headers: { "Content-Type": "application/json" },
  //   body: {
  //     status: "success",
  //     data: {
  //       channel: channelInformation,
  //     },
  //   },
  // });
};
