import { APIGatewayProxyEventV2 } from "aws-lambda";
import { handler } from "@/lambdas/deleteUser";
import { mockCallback, mockContext, mockEvent } from "./constants";

const eventNoParams: APIGatewayProxyEventV2 = {
  ...mockEvent,
  pathParameters: undefined,
};

const eventBadUserId: APIGatewayProxyEventV2 = {
  ...mockEvent,
  pathParameters: {
    channel_id: "1234",
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
        data: {
          user: "User ID is required.",
        },
      },
    })
  );
});

it("returns bad request for incorrect format of user information", async () => {
  const response = await handler(eventBadUserId, mockContext, mockCallback);
  expect(response).toBe(
    JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        status: "fail",
        data: {
          user: "User ID is invalid.",
        },
      },
    })
  );
});
