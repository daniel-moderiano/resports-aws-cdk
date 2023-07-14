import { APIGatewayProxyEventV2 } from "aws-lambda";
import { handler } from "@/lambdas/getUserSavedChannels";
import { mockCallback, mockContext, mockEvent } from "./constants";

const eventNoParams: APIGatewayProxyEventV2 = {
  ...mockEvent,
  pathParameters: undefined,
};

const eventBadSavedChannel: APIGatewayProxyEventV2 = {
  ...mockEvent,
  pathParameters: {
    channel_id: "1234",
  },
};

it("returns bad request for missing parameters", async () => {
  const response = await handler(eventNoParams, mockContext, mockCallback);
  expect(response).toBe(
    JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        status: "fail",
        message: "User ID is missing.",
      },
    })
  );
});

it("returns bad request for incorrect format of user information", async () => {
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
        status: "fail",
        message: "User ID is invalid.",
      },
    })
  );
});
