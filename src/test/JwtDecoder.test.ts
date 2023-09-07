import { getUserIdFromLambdaEvent } from "@/helpers/JwtDecoder";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import jwt from "jsonwebtoken";
import { mockEvent } from "./constants";

describe("getUserIdFromLambdaEvent", () => {
  it("should return the user ID from a valid token", () => {
    const mockToken = jwt.sign({ sub: "1234567890" }, "my-secret", {
      algorithm: "HS256",
    });
    const event: APIGatewayProxyEventV2 = {
      ...mockEvent,
      headers: {
        Authorization: `Bearer ${mockToken}`,
      },
    };
    expect(getUserIdFromLambdaEvent(event)).toBe("1234567890");
  });

  it("should throw an error if no authorization header is present", () => {
    const event: APIGatewayProxyEventV2 = {
      ...mockEvent,
      headers: {},
    };

    expect(() => getUserIdFromLambdaEvent(event)).toThrow(
      "No authorization header found in request"
    );
  });

  it("should throw an error if the authorization header does not contain a token", () => {
    const event: APIGatewayProxyEventV2 = {
      ...mockEvent,
      headers: {
        Authorization: "Bearer",
      },
    };

    expect(() => getUserIdFromLambdaEvent(event)).toThrow(
      "Failed to decode token correctly"
    );
  });

  it("should throw an error if the token cannot be decoded", () => {
    const event: APIGatewayProxyEventV2 = {
      ...mockEvent,
      headers: {
        Authorization: "Bearer invalidtoken",
      },
    };

    expect(() => getUserIdFromLambdaEvent(event)).toThrow(
      "Failed to decode token"
    );
  });

  it("should throw an error if the token does not contain a sub claim", () => {
    const mockToken = jwt.sign({ notSub: "1234567890" }, "my-secret", {
      algorithm: "HS256",
    });
    const event: APIGatewayProxyEventV2 = {
      ...mockEvent,
      headers: {
        Authorization: `Bearer ${mockToken}`,
      },
    };

    expect(() => getUserIdFromLambdaEvent(event)).toThrow(
      "User ID (sub) not found in token"
    );
  });
});
