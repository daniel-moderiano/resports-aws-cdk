import { Handler } from "aws-lambda";

export const addChannel: Handler = async function () {
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: "Add channels",
  };
};
