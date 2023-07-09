import { APIGatewayProxyEventV2 } from "aws-lambda";
import { handler } from "@/lambdas/deleteSavedChannel";
import { mockCallback, mockContext, mockEvent } from "./constants";

const eventNoParams: APIGatewayProxyEventV2 = {
  ...mockEvent,
  body: undefined,
};

const eventBadSavedChannel: APIGatewayProxyEventV2 = {
  ...mockEvent,
  body: JSON.stringify({
    user_id: "1234",
    channel: "1234",
  }),
};

it("returns bad request for missing body", async () => {
  const response = await handler(eventNoParams, mockContext, mockCallback);
  expect(response).toBe(
    JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        status: "fail",
        data: {
          savedChannel: "User and/or channel data is missing.",
        },
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
        status: "fail",
        data: {
          savedChannel: "Incorrect user and/or channel data.",
        },
      },
    })
  );
});
