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
        message: "Bad request. Missing user ID.",
      },
    });
  }

  if (!is(userInformation, UserIdStruct)) {
    return JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "Bad request. Invalid user ID.",
      },
    });
  }

  // Auth0 Request here

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
  console.log(accessToken);

  return JSON.stringify({
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: {
      message: "Initial setup correct",
    },
  });
};
