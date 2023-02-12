import { Handler } from "aws-lambda";

export const updateChannel: Handler = async function () {
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: "Update channel",
  };
};
