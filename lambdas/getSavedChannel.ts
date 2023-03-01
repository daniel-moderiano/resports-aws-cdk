import { APIGatewayProxyEventV2, Handler } from "aws-lambda";

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: "Get saved channel",
  };
};
