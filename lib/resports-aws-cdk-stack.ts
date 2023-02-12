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

export class ResportsAwsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const nodeJsFunctionProps: NodejsFunctionProps = {
      runtime: lambda.Runtime.NODEJS_16_X, // execution environment
    };

    // defines an AWS Lambda resource
    const hello = new NodejsFunction(this, "HelloHandler", {
      entry: join(__dirname, "/../lambdas", "hello.ts"),
      ...nodeJsFunctionProps,
    });

    // Integrate our hello function with the HTTP API. This connects the API route to the lambda service
    const helloIntegration = new HttpLambdaIntegration(
      "HelloIntegration",
      hello
    );

    // defines an API Gateway HTTP API resource
    const httpApi = new HttpApi(this, "HttpApi");

    // Define the REST channel routes
    httpApi.addRoutes({
      path: "/channels",
      methods: [HttpMethod.GET],
      integration: helloIntegration,
    });

    httpApi.addRoutes({
      path: "/channels/{channelId}",
      methods: [HttpMethod.GET],
      integration: helloIntegration,
    });

    httpApi.addRoutes({
      path: "/channels/{channelId}",
      methods: [HttpMethod.POST],
      integration: helloIntegration,
    });

    httpApi.addRoutes({
      path: "/channels/{channelId}",
      methods: [HttpMethod.PUT],
      integration: helloIntegration,
    });

    httpApi.addRoutes({
      path: "/channels/{channelId}",
      methods: [HttpMethod.DELETE],
      integration: helloIntegration,
    });

    new cdk.CfnOutput(this, "apiUrl", {
      value: httpApi.url ? httpApi.url : "No URL found",
    });
  }
}
