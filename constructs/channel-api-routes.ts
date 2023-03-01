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
import { SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { databaseConfig } from "../config/database";
import { Duration } from "aws-cdk-lib";

interface ChannelRoutesProps {
  httpApi: HttpApi;
  authorizer: HttpJwtAuthorizer;
  vpc: Vpc;
}

export class ChannelApiRoutes extends Construct {
  constructor(scope: Construct, id: string, props: ChannelRoutesProps) {
    super(scope, id);

    const { httpApi, authorizer, vpc } = props;

    const nodeJsFunctionProps: NodejsFunctionProps = {
      runtime: lambda.Runtime.NODEJS_16_X,
      vpc: vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_ISOLATED },
      environment: databaseConfig,
      timeout: Duration.seconds(30),
    };

    const addChannel = new NodejsFunction(this, "AddChannelHandler", {
      entry: join(__dirname, "/../lambdas", "addChannel.ts"),
      ...nodeJsFunctionProps,
    });

    const deleteChannel = new NodejsFunction(this, "DeleteChannelHandler", {
      entry: join(__dirname, "/../lambdas", "deleteChannel.ts"),
      ...nodeJsFunctionProps,
    });

    const privateLambda = new NodejsFunction(this, "PrivateLambda", {
      entry: join(__dirname, "/../lambdas", "private.ts"),
      ...nodeJsFunctionProps,
    });

    const privateIntegration = new HttpLambdaIntegration(
      "PrivateIntegration",
      privateLambda
    );

    const addChannelIntegration = new HttpLambdaIntegration(
      "AddChannelIntegration",
      addChannel
    );

    const deleteChannelIntegration = new HttpLambdaIntegration(
      "DeleteChannelIntegration",
      deleteChannel
    );

    httpApi.addRoutes({
      path: "/channels",
      methods: [HttpMethod.POST],
      integration: addChannelIntegration,
      authorizer,
    });

    httpApi.addRoutes({
      path: "/channels/{channelId}",
      methods: [HttpMethod.DELETE],
      integration: deleteChannelIntegration,
      authorizer,
    });

    httpApi.addRoutes({
      path: "/private",
      methods: [HttpMethod.GET],
      integration: privateIntegration,
      // authorizer,
    });
  }
}
