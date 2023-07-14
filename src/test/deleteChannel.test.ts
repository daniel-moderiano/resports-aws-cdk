import { APIGatewayProxyEventV2 } from "aws-lambda";
import { handler } from "@/lambdas/deleteChannel";
import { mockCallback, mockContext, mockEvent } from "./constants";

const eventNoParams: APIGatewayProxyEventV2 = {
  ...mockEvent,
  pathParameters: undefined,
};

const eventBadChannelId: APIGatewayProxyEventV2 = {
  ...mockEvent,
  pathParameters: {
    user_id: "1234",
  },
};

it("returns bad request for missing path params", async () => {
  const response = await handler(eventNoParams, mockContext, mockCallback);
  expect(response).toBe(
    JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        status: "fail",
        message: "Channel ID is required",
      },
    })
  );
});

it("returns bad request for incorrect format of channel information", async () => {
  const response = await handler(eventBadChannelId, mockContext, mockCallback);
  expect(response).toBe(
    JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        status: "fail",
        message: "Channel ID is incorrectly formatted",
      },
    })
  );
});
