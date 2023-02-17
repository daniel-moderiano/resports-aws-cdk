import { APIGatewayProxyCallbackV2, Context, Handler } from "aws-lambda";

export const handler: Handler = async function (
  event: APIGatewayProxyCallbackV2
) {
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(event),
  };
};
