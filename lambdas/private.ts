import { Handler, APIGatewayProxyEventV2 } from "aws-lambda";

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: "You've activated the private handler",
  };
};
