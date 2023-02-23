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
import { env } from "../config/database";
import { Duration } from "aws-cdk-lib";

interface ChannelRoutesProps {
  httpApi: HttpApi;
  authorizer: HttpJwtAuthorizer;
  vpc?: Vpc;
}

export const nodeJsFunctionProps: NodejsFunctionProps = {
  runtime: lambda.Runtime.NODEJS_16_X, // execution environment
};

export class ChannelApiRoutes extends Construct {
  constructor(scope: Construct, id: string, props: ChannelRoutesProps) {
    super(scope, id);

    const { httpApi, authorizer, vpc } = props;

    const upsertChannel = new NodejsFunction(this, "UpsertChannelHandler", {
      entry: join(__dirname, "/../lambdas", "upsertChannel.ts"),
      ...nodeJsFunctionProps,
    });

    const deleteChannel = new NodejsFunction(this, "DeleteChannelHandler", {
      entry: join(__dirname, "/../lambdas", "deleteChannel.ts"),
      ...nodeJsFunctionProps,
    });

    const privateLambda = new NodejsFunction(this, "PrivateLambda", {
      entry: join(__dirname, "/../lambdas", "private.ts"),
      vpc: vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_ISOLATED },
      environment: {
        DATABASE_HOST: env.DATABASE_HOST,
        DATABASE_NAME: env.DATABASE_NAME,
        DATABASE_PASSWORD: env.DATABASE_PASSWORD,
        DATABASE_USER: env.DATABASE_USER,
      },
      timeout: Duration.seconds(30),

      ...nodeJsFunctionProps,
    });

    const privateIntegration = new HttpLambdaIntegration(
      "PrivateIntegration",
      privateLambda
    );

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

    httpApi.addRoutes({
      path: "/private",
      methods: [HttpMethod.GET],
      integration: privateIntegration,
      // authorizer,
    });
  }
}
