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

    const upsertChannel = new NodejsFunction(this, "AddChannelHandler", {
      entry: join(__dirname, "/../lambdas", "addChannel.ts"),
      ...nodeJsFunctionProps,
    });

    const deleteChannel = new NodejsFunction(this, "DeleteChannelHandler", {
      entry: join(__dirname, "/../lambdas", "deleteChannel.ts"),
      ...nodeJsFunctionProps,
    });

    const upsertChannelIntegration = new HttpLambdaIntegration(
      "UpsertChannelIntegration",
      upsertChannel
    );

    const deleteChannelIntegration = new HttpLambdaIntegration(
      "DeleteChannelIntegration",
      deleteChannel
    );

    httpApi.addRoutes({
      path: "/channels/{channelId}",
      methods: [HttpMethod.POST],
      integration: upsertChannelIntegration,
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
