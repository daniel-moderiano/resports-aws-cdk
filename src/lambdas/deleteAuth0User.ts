import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { is, object, string } from "superstruct";
import axios, { AxiosResponse } from "axios";
import { Auth0AccessTokenResponse } from "@/types";
import { createFailResponse, createSuccessResponse } from "@/helpers";
import { lambdaEnv } from "@/config";

const UserIdStruct = object({
  user_id: string(),
});

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  const userInformation = event.pathParameters;

  if (!userInformation) {
    return createFailResponse(400, {
      user: "User ID is required.",
    });
  }

  if (!is(userInformation, UserIdStruct)) {
    return createFailResponse(400, {
      user: "User ID is invalid.",
    });
  }

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
  await axios.request({
    method: "DELETE",
    url: `https://${lambdaEnv.AUTH0_DOMAIN}/api/v2/users/${userInformation.user_id}`,
    headers: { authorization: `Bearer ${accessToken}` },
  });

  return createSuccessResponse(204, null);
};
