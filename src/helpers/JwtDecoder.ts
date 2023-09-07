import { APIGatewayProxyEventV2 } from "aws-lambda";
import { decode } from "jsonwebtoken";

/**
 * Helper to extract the user ID from a lambda request event.
 *
 * @param event AWS lambda handler event. Contains the auth header which should
 * in turn contain the Auth0 JWT with user ID
 * @returns The user ID as a string, or throws an error if the user ID cannot be obtained
 */
export const getUserIdFromLambdaEvent = (
  event: APIGatewayProxyEventV2
): string => {
  const authHeader = event.headers.Authorization ?? event.headers.authorization;

  if (!authHeader) {
    throw new Error("No authorization header");
  }

  const token = authHeader.split(" ")[1];

  const decodedJwt = decode(token);

  if (!decodedJwt || typeof decodedJwt === "string") {
    throw new Error("Failed to decode token correctly");
  }

  if (!decodedJwt.sub) {
    throw new Error("User ID (sub) not found in token");
  }

  return decodedJwt.sub;
};
