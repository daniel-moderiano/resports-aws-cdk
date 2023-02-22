import * as cdk from "aws-cdk-lib";
import { HttpApi } from "@aws-cdk/aws-apigatewayv2-alpha";
import { Construct } from "constructs";
import { HttpJwtAuthorizer } from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";
import { ChannelApiRoutes } from "../constructs/channel-api-routes";
import { UserApiRoutes } from "../constructs/user-api-routes";
import { SavedChannelApiRoutes } from "../constructs/saved-channels-api-routes";
import { VPC } from "../constructs/vpc";
import { PostgresDatabase } from "../constructs/database";

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

    const vpc = new VPC(this, "VPC");
    const database = new PostgresDatabase(this, "ResportsDatabase", {
      vpc: vpc.vpc,
      securityGroup: vpc.securityGroup,
    });

    new ChannelApiRoutes(this, "ChannelApiRoutes", {
      httpApi,
      authorizer,
      vpc: vpc.vpc,
    });

    new UserApiRoutes(this, "UserApiRoutes", {
      httpApi,
      authorizer,
    });

    new SavedChannelApiRoutes(this, "SavedChannelApiRoutes", {
      httpApi,
      authorizer,
    });

    new cdk.CfnOutput(this, "apiUrl", {
      value: httpApi.url ? httpApi.url : "No URL found",
    });
  }
}
