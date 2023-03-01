import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { assert } from "superstruct";
import { ChannelStruct } from "../types";

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  if (!event.body) {
    return JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "Bad request. Missing request body.",
      },
    });
  }

  const requestBody = JSON.parse(event.body);

  console.log(requestBody);

  console.log(assert(requestBody, ChannelStruct));

  return JSON.stringify({
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: {
      message: "Channel added successfully",
      data: event.body,
    },
  });
};
