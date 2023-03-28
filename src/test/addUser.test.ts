import { APIGatewayProxyEventV2 } from "aws-lambda";
import { handler } from "@/lambdas/addUser";
import { mockCallback, mockContext, mockEvent } from "./constants";

const eventNoBody: APIGatewayProxyEventV2 = {
  ...mockEvent,
  body: undefined,
};

const eventBadUser: APIGatewayProxyEventV2 = {
  ...mockEvent,
  body: JSON.stringify({
    user_id: "123",
    email: "test@gmail.com",
  }),
};

it("returns bad request for missing body", async () => {
  const response = await handler(eventNoBody, mockContext, mockCallback);
  expect(response).toBe(
    JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        status: "fail",
        data: {
          user: "User data is required",
        },
      },
    })
  );
});

it("returns bad request for incorrect format of user information", async () => {
  const response = await handler(eventBadUser, mockContext, mockCallback);
  expect(response).toBe(
    JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        status: "fail",
        data: {
          user: "User data is incorrectly formatted",
        },
      },
    })
  );
});
