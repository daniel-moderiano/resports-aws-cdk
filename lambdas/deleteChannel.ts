import { Handler } from "aws-lambda";

export const deleteChannel: Handler = async function () {
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: "Delete channel",
  };
};
