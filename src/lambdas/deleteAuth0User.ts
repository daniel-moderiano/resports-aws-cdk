import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { is, object, string } from "superstruct";
import axios, { AxiosResponse } from "axios";
import { auth0Config } from "@/config/auth0";
import { Auth0AccessTokenResponse } from "@/types";

const UserIdStruct = object({
  user_id: string(),
});

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  const userInformation = event.pathParameters;

  if (!userInformation) {
    return JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        status: "fail",
        data: {
          user: "User ID is required",
        },
      },
    });
  }

  if (!is(userInformation, UserIdStruct)) {
    return JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        status: "fail",
        data: {
          user: "User ID is invalid",
        },
      },
    });
  }

  // Get Management API Access Token
  const accessTokenResponse: AxiosResponse<Auth0AccessTokenResponse> =
    await axios.request({
      method: "POST",
      url: `https://${auth0Config.AUTH0_DOMAIN}/oauth/token`,
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: auth0Config.AUTH0_CLIENT_ID,
        client_secret: auth0Config.AUTH0_CLIENT_SECRET,
        audience: `https://${auth0Config.AUTH0_DOMAIN}/api/v2/`,
      }),
    });

  const accessToken = accessTokenResponse.data.access_token;

  // Use this access token to make a user delete request to the management API
  // Request will succeed even if the user does not exist in the database (provided ID is in valid format)
  await axios.request({
    method: "DELETE",
    url: `https://${auth0Config.AUTH0_DOMAIN}/api/v2/users/${userInformation.user_id}`,
    headers: { authorization: `Bearer ${accessToken}` },
  });

  return JSON.stringify({
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: {
      status: "success",
      data: null,
    },
  });
};
