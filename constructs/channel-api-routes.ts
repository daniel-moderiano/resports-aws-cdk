import { HttpApi, HttpMethod } from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpJwtAuthorizer } from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";
import * as lambda from "aws-cdk-lib/aws-lambda";

interface ChannelRoutesProps {
  httpApi: HttpApi;
  authorizer: HttpJwtAuthorizer;
}

export const nodeJsFunctionProps: NodejsFunctionProps = {
  runtime: lambda.Runtime.NODEJS_16_X, // execution environment
};

export class ChannelApiRoutes extends Construct {
  constructor(scope: Construct, id: string, props: ChannelRoutesProps) {
    super(scope, id);

    const { httpApi, authorizer } = props;

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
      authorizer,
    });

    httpApi.addRoutes({
      path: "/channels/{channelId}",
      methods: [HttpMethod.POST],
      integration: addChannelIntegration,
      authorizer,
    });

    httpApi.addRoutes({
      path: "/channels/{channelId}",
      methods: [HttpMethod.PUT],
      integration: updateChannelIntegration,
      authorizer,
    });

    httpApi.addRoutes({
      path: "/channels/{channelId}",
      methods: [HttpMethod.DELETE],
      integration: deleteChannelIntegration,
      authorizer,
    });
  }
}
