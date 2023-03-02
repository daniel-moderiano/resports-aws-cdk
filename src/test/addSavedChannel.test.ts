import { APIGatewayProxyEventV2 } from "aws-lambda";
import { handler } from "@/lambdas/addSavedChannel";
import { mockCallback, mockContext, mockEvent } from "./constants";

const eventNoBody: APIGatewayProxyEventV2 = {
  ...mockEvent,
  body: undefined,
};

const eventBadSavedChannel: APIGatewayProxyEventV2 = {
  ...mockEvent,
  body: JSON.stringify({
    user_id: "1234",
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
        message: "Bad request. Missing channel and/or user information.",
      },
    })
  );
});

it("returns bad request for incorrect format of channel information", async () => {
  const response = await handler(
    eventBadSavedChannel,
    mockContext,
    mockCallback
  );
  expect(response).toBe(
    JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "Bad request. Invalid channel and/or user information.",
      },
    })
  );
});
