import { HttpApi, HttpMethod } from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpJwtAuthorizer } from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";
import { nodeJsFunctionProps } from "../lib/resports-aws-cdk-stack";

interface ChannelRoutesProps {
  httpApi: HttpApi;
  authorizer: HttpJwtAuthorizer;
}

export class ChannelRoutes extends Construct {
  public readonly topic: string;

  constructor(
    scope: Construct,
    id: string,
    { httpApi, authorizer }: ChannelRoutesProps
  ) {
    super(scope, id);

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
  }
}
