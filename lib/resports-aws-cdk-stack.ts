import * as cdk from "aws-cdk-lib";
import { HttpApi } from "@aws-cdk/aws-apigatewayv2-alpha";
import { Construct } from "constructs";
import { HttpJwtAuthorizer } from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";
import { ChannelApiRoutes } from "../constructs/channel-api-routes";
import { UserApiRoutes } from "../constructs/user-api-routes";
import { SavedChannelApiRoutes } from "../constructs/saved-channels-api-routes";
import { VPC } from "../constructs/vpc";
import { PostgresDatabase } from "../constructs/database";
import { databaseConfig } from "../config/database";
import { SubnetType } from "aws-cdk-lib/aws-ec2";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { join } from "path";
import { Duration } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";

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

    // Database initialiser lambda. Should be called manually via CLI or console as this WILL erase the database
    new NodejsFunction(this, "DatabaseInitialiser", {
      entry: join(__dirname, "/../lambdas", "initialiseDatabase.ts"),
      vpc: vpc.vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_ISOLATED },
      environment: databaseConfig,
      timeout: Duration.seconds(30),
      runtime: lambda.Runtime.NODEJS_16_X,
    });

    new ChannelApiRoutes(this, "ChannelApiRoutes", {
      httpApi,
      authorizer,
      vpc: vpc.vpc,
    });

    new UserApiRoutes(this, "UserApiRoutes", {
      httpApi,
      authorizer,
      vpc: vpc.vpc,
    });

    new SavedChannelApiRoutes(this, "SavedChannelApiRoutes", {
      httpApi,
      authorizer,
      vpc: vpc.vpc,
    });

    new cdk.CfnOutput(this, "apiUrl", {
      value: httpApi.url ? httpApi.url : "No URL found",
    });
  }
}
