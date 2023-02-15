import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import {
  HttpApi,
  HttpMethod,
  HttpAuthorizer,
  HttpAuthorizerType,
} from "@aws-cdk/aws-apigatewayv2-alpha";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { CognitoUserPool } from "../constructs/cognito-user-pool";
import { HttpUserPoolAuthorizer } from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";

export class ResportsAwsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Instantiate the separately defined cognito construct
    const userPool = new CognitoUserPool(this, "CognitoUserPool");

    const nodeJsFunctionProps: NodejsFunctionProps = {
      runtime: lambda.Runtime.NODEJS_16_X, // execution environment
    };

    // defines an AWS Lambda resource
    const hello = new NodejsFunction(this, "HelloHandler", {
      entry: join(__dirname, "/../lambdas", "hello.ts"),
      ...nodeJsFunctionProps,
    });

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

    // Integrate our hello function with the HTTP API. This connects the API route to the lambda service
    const helloIntegration = new HttpLambdaIntegration(
      "HelloIntegration",
      hello
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

    // Define the REST channel routes
    httpApi.addRoutes({
      path: "/channels",
      methods: [HttpMethod.GET],
      integration: getAllChannelsIntegration,
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

    // Create a general Authorizer for handling secure API requests, that can later be attached to certain routes
    const authorizer = new HttpAuthorizer(this, "HttpAuthorizer", {
      httpApi: httpApi,
      identitySource: ["$request.header.Authorization"],
      type: HttpAuthorizerType.JWT,
    });

    new cdk.CfnOutput(this, "apiUrl", {
      value: httpApi.url ? httpApi.url : "No URL found",
    });
  }
}
