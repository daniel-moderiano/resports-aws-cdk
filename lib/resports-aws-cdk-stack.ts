import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { HttpApi, HttpMethod } from "@aws-cdk/aws-apigatewayv2-alpha";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { HttpJwtAuthorizer } from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";
import { ChannelApiRoutes } from "../constructs/channel-api-routes";
import { UserApiRoutes } from "../constructs/user-api-routes";

export class ResportsAwsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // defines an API Gateway HTTP API resource
    const httpApi = new HttpApi(this, "HttpApi");

    // Define a JWT authorizer configured to accept Auth0 JWTs from a pre-specified Auth0 API
    const authorizer = new HttpJwtAuthorizer(
      "Auth0JwtAuthorizer",
      "https://dev-c0yb5cr7.us.auth0.com/",
      {
        jwtAudience: ["https://auth0-jwt-authorizer"],
        identitySource: ["$request.header.Authorization"],
      }
    );

    new ChannelApiRoutes(this, "ChannelApiRoutes", {
      httpApi,
      authorizer,
    });

    new UserApiRoutes(this, "UserApiRoutes", {
      httpApi,
      authorizer,
    });

    new cdk.CfnOutput(this, "apiUrl", {
      value: httpApi.url ? httpApi.url : "No URL found",
    });
  }
}
