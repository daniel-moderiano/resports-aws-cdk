import { Handler } from "aws-lambda";

export const handler: Handler = async function () {
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: "Get saved channels for user",
  };
};