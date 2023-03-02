import { APIGatewayProxyEventV2 } from "aws-lambda";
import { handler } from "@/lambdas/addChannel";
import { mockCallback, mockContext, mockEvent } from "./constants";

const eventNoBody: APIGatewayProxyEventV2 = {
  ...mockEvent,
  body: undefined,
};

const eventBadChannel: APIGatewayProxyEventV2 = {
  ...mockEvent,
  body: JSON.stringify({
    channelId: 123,
    platform: "twitch",
  }),
};

it("returns bad request for missing body", async () => {
  const response = await handler(eventNoBody, mockContext, mockCallback);
  expect(response).toBe(
    JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "Bad request. Missing request body.",
      },
    })
  );
});

it("returns bad request for incorrect format of channel information", async () => {
  const response = await handler(eventBadChannel, mockContext, mockCallback);
  expect(response).toBe(
    JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "Bad request. Invalid channel information.",
      },
    })
  );
});
