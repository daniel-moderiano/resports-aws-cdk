import { APIGatewayProxyEventV2 } from "aws-lambda";
import { handler } from "@/lambdas/deleteSavedChannel";
import { mockCallback, mockContext, mockEvent } from "./constants";

const eventNoParams: APIGatewayProxyEventV2 = {
  ...mockEvent,
  pathParameters: undefined,
};

const eventBadSavedChannel: APIGatewayProxyEventV2 = {
  ...mockEvent,
  pathParameters: {
    notUserId: "1234",
    channel: "1234",
  },
};

it("returns bad request for missing body", async () => {
  const response = await handler(eventNoParams, mockContext, mockCallback);
  expect(response).toBe(
    JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        errorMessage: "User and/or channel ID is missing.",
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
        errorMessage: "User and/or channel parameters are invalid",
      },
    })
  );
});
