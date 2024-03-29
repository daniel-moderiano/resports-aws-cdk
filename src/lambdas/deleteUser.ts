import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import {
  createErrorHttpResponse,
  createSuccessHttpResponse,
  deleteUser,
  handleDbConnection,
} from "@/helpers";
import axios, { AxiosResponse } from "axios";
import { lambdaEnv } from "@/config";
import { Auth0AccessTokenResponse } from "@/types";
import mongoose from "mongoose";
import { getUserIdFromLambdaEvent } from "@/helpers/JwtDecoder";

const deleteAuth0User = async (userId: string) => {
  // Get Management API Access Token
  const accessTokenResponse: AxiosResponse<Auth0AccessTokenResponse> =
    await axios.request({
      method: "POST",
      url: `https://${lambdaEnv.AUTH0_DOMAIN}/oauth/token`,
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: lambdaEnv.AUTH0_CLIENT_ID,
        client_secret: lambdaEnv.AUTH0_CLIENT_SECRET,
        audience: `https://${lambdaEnv.AUTH0_DOMAIN}/api/v2/`,
      }),
    });

  const accessToken = accessTokenResponse.data.access_token;

  // Use this access token to make a user delete request to the management API
  // Request will succeed even if the user does not exist in the database (provided ID is in valid format)
  return axios.request({
    method: "DELETE",
    url: `https://${lambdaEnv.AUTH0_DOMAIN}/api/v2/users/${userId}`,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  const userId = getUserIdFromLambdaEvent(event);

  const errorResponse = await handleDbConnection();
  if (errorResponse) return errorResponse;
  const session = await mongoose.startSession();

  try {
    // ! All queries must include the session in their options
    session.startTransaction();

    const deletedUser = await deleteUser(userId, session);

    if (!deletedUser) {
      throw new Error("Error with mongo user delete operation");
    }

    // The axios requests within this function will throw their own errors for status outside of 200-209
    await deleteAuth0User(userId);

    await session.commitTransaction();
    return createSuccessHttpResponse(204, null);
  } catch (error) {
    await session.abortTransaction();
    return createErrorHttpResponse(500, "Failed to delete user");
  } finally {
    session.endSession();
  }
};
