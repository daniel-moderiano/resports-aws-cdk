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

interface SavedChannelRoutesProps {
  httpApi: HttpApi;
  authorizer: HttpJwtAuthorizer;
}

export const nodeJsFunctionProps: NodejsFunctionProps = {
  runtime: lambda.Runtime.NODEJS_16_X, // execution environment
};

export class SavedChannelApiRoutes extends Construct {
  constructor(scope: Construct, id: string, props: SavedChannelRoutesProps) {
    super(scope, id);

    const { httpApi, authorizer } = props;

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
      path: "/savedChannels/{savedChannelId}",
      methods: [HttpMethod.GET],
      integration: getSavedChannelIntegration,
      authorizer,
    });

    httpApi.addRoutes({
      path: "/savedChannels/{savedChannelId}",
      methods: [HttpMethod.POST],
      integration: addSavedChannelIntegration,
      authorizer,
    });

    httpApi.addRoutes({
      path: "/savedChannels/{savedChannelId}",
      methods: [HttpMethod.DELETE],
      integration: deleteSavedChannelIntegration,
      authorizer,
    });
  }
}
