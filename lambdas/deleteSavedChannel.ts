import { Handler } from "aws-lambda";

export const handler: Handler = async function () {
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: "Delete saved channel",
  };
};
