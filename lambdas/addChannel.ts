import { APIGatewayProxyEventV2, Handler } from "aws-lambda";

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  if (!event.body) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "Bad request. Missing request body.",
      },
    };
  }
  return {
    statusCode: 400,
    headers: { "Content-Type": "application/json" },
    body: {
      message: "Channel added successfully",
      data: event.body,
    },
  };
};
