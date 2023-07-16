import { APIGatewayProxyEventV2 } from "aws-lambda";
import { handler } from "@/lambdas/addSavedChannel";
import { mockCallback, mockContext, mockEvent } from "./constants";

const eventNoParams: APIGatewayProxyEventV2 = {
  ...mockEvent,
  pathParameters: undefined,
  body: JSON.stringify({
    userId: "1234",
    platform: "twitch",
  }),
};

const eventNoBody: APIGatewayProxyEventV2 = {
  ...mockEvent,
  pathParameters: {
    userId: "1234",
  },
  body: undefined,
};

const eventBadSavedChannel: APIGatewayProxyEventV2 = {
  ...mockEvent,
  pathParameters: {
    userId: "1234",
  },
  body: JSON.stringify({
    userId: "1234",
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
        errorMessage: "Channel data is missing.",
      },
    })
  );
});

it("returns bad request for missing URL params", async () => {
  const response = await handler(eventNoParams, mockContext, mockCallback);
  expect(response).toBe(
    JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        errorMessage: "User ID is missing.",
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
        errorMessage: "Invalid channel data.",
      },
    })
  );
});
