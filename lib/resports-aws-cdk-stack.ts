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

export class ResportsAwsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const nodeJsFunctionProps: NodejsFunctionProps = {
      runtime: lambda.Runtime.NODEJS_16_X, // execution environment
    };

    // Define all Channel Lambda resources
    const getAllChannels = new NodejsFunction(this, "GetAllChannelsHandler", {
      entry: join(__dirname, "/../lambdas", "getAllChannels.ts"),
      ...nodeJsFunctionProps,
    });

    const getChannel = new NodejsFunction(this, "GetChannelHandler", {
      entry: join(__dirname, "/../lambdas", "getChannel.ts"),
      ...nodeJsFunctionProps,
    });

    const addChannel = new NodejsFunction(this, "AddChannelHandler", {
      entry: join(__dirname, "/../lambdas", "addChannel.ts"),
      ...nodeJsFunctionProps,
    });

    const updateChannel = new NodejsFunction(this, "UpdateChannelHandler", {
      entry: join(__dirname, "/../lambdas", "updateChannel.ts"),
      ...nodeJsFunctionProps,
    });

    const deleteChannel = new NodejsFunction(this, "DeleteChannelHandler", {
      entry: join(__dirname, "/../lambdas", "deleteChannel.ts"),
      ...nodeJsFunctionProps,
    });

    // Define user POST integration
    const upsertUser = new NodejsFunction(this, "UpsertUserHandler", {
      entry: join(__dirname, "/../lambdas", "registerUser.ts"),
      ...nodeJsFunctionProps,
    });

    const upsertUserIntegration = new HttpLambdaIntegration(
      "UpsertUserIntegration",
      upsertUser
    );

    // Add lambda integrations for each channel handler
    const getAllChannelsIntegration = new HttpLambdaIntegration(
      "GetAllChannelsIntegration",
      getAllChannels
    );

    const getChannelIntegration = new HttpLambdaIntegration(
      "GetChannelIntegration",
      getChannel
    );

    const addChannelIntegration = new HttpLambdaIntegration(
      "AddChannelIntegration",
      addChannel
    );

    const updateChannelIntegration = new HttpLambdaIntegration(
      "UpdateChannelIntegration",
      updateChannel
    );

    const deleteChannelIntegration = new HttpLambdaIntegration(
      "DeleteChannelIntegration",
      deleteChannel
    );

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

    // Define the REST channel routes
    httpApi.addRoutes({
      path: "/channels",
      methods: [HttpMethod.GET],
      integration: getAllChannelsIntegration,
      authorizer,
    });

    httpApi.addRoutes({
      path: "/channels/{channelId}",
      methods: [HttpMethod.GET],
      integration: getChannelIntegration,
    });

    httpApi.addRoutes({
      path: "/channels/{channelId}",
      methods: [HttpMethod.POST],
      integration: addChannelIntegration,
    });

    httpApi.addRoutes({
      path: "/channels/{channelId}",
      methods: [HttpMethod.PUT],
      integration: updateChannelIntegration,
    });

    httpApi.addRoutes({
      path: "/channels/{channelId}",
      methods: [HttpMethod.DELETE],
      integration: deleteChannelIntegration,
    });

    httpApi.addRoutes({
      path: "/users",
      methods: [HttpMethod.POST],
      integration: upsertUserIntegration,
      authorizer,
    });

    new cdk.CfnOutput(this, "apiUrl", {
      value: httpApi.url ? httpApi.url : "No URL found",
    });
  }
}
