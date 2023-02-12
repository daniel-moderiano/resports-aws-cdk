import { Handler } from "aws-lambda";

export const getChannel: Handler = async function () {
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: "Get channels",
  };
};