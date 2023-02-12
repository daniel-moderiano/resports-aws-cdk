import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { HttpApi } from "@aws-cdk/aws-apigatewayv2-alpha";

import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

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

    // defines an API Gateway HTTP API resource
    const httpApi = new HttpApi(this, "HttpApi");
  }
}
