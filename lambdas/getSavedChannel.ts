import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { APIRequestBody } from "../types";

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  if (event.body) {
    const body: APIRequestBody = JSON.parse(event.body);
    console.log(body.user);
  } else {
    console.log("Incorrect request format");
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: "Get saved channel",
  };
};
