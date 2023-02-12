import { APIGatewayProxyEventV2, Context, Handler } from "aws-lambda";

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  console.log("request:", JSON.stringify(event, undefined, 2));
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `
      Hello, you've hit ${event.rawPath}!\n
      The params are ${JSON.stringify(event.pathParameters)}.\n
      The method is ${event.routeKey.split(" ")[0]}
    `,
  };
};
