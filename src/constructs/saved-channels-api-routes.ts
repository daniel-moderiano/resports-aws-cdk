import { HttpMethod } from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";
import { SubnetType } from "aws-cdk-lib/aws-ec2";
import { databaseConfig } from "../config/database";
import { Duration } from "aws-cdk-lib";
import { ApiRoutesProps } from "./http-api";
import { Runtime } from "aws-cdk-lib/aws-lambda";

export class SavedChannelApiRoutes extends Construct {
  constructor(scope: Construct, id: string, props: ApiRoutesProps) {
    super(scope, id);

    const { httpApi, authorizer, vpc } = props;

    const nodeJsFunctionProps: NodejsFunctionProps = {
      runtime: Runtime.NODEJS_16_X,
      vpc: vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_ISOLATED },
      environment: databaseConfig,
      timeout: Duration.seconds(30),
    };

    const getSavedChannel = new NodejsFunction(this, "GetSavedChannelHandler", {
      entry: join(__dirname, "/../lambdas", "getSavedChannel.ts"),
      ...nodeJsFunctionProps,
    });

    const addSavedChannel = new NodejsFunction(this, "AddSavedChannelHandler", {
      entry: join(__dirname, "/../lambdas", "addSavedChannel.ts"),
      ...nodeJsFunctionProps,
    });

    const deleteSavedChannel = new NodejsFunction(
      this,
      "DeleteSavedChannelHandler",
      {
        entry: join(__dirname, "/../lambdas", "deleteSavedChannel.ts"),
        ...nodeJsFunctionProps,
      }
    );

    const getSavedChannelIntegration = new HttpLambdaIntegration(
      "GetSavedChannelIntegration",
      getSavedChannel
    );

    const addSavedChannelIntegration = new HttpLambdaIntegration(
      "AddSavedChannelIntegration",
      addSavedChannel
    );

    const deleteSavedChannelIntegration = new HttpLambdaIntegration(
      "DeleteSavedChannelIntegration",
      deleteSavedChannel
    );

    httpApi.addRoutes({
      path: "/saved-channels",
      methods: [HttpMethod.GET],
      integration: getSavedChannelIntegration,
      authorizer,
    });

    httpApi.addRoutes({
      path: "/saved-channels",
      methods: [HttpMethod.POST],
      integration: addSavedChannelIntegration,
      authorizer,
    });

    httpApi.addRoutes({
      path: "/saved-channels",
      methods: [HttpMethod.DELETE],
      integration: deleteSavedChannelIntegration,
      authorizer,
    });
  }
}
