import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { VPC, APIGateway } from "@/constructs";

export class ResportsAwsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new VPC(this, "VPC");

    const httpApi = new APIGateway(this, "HttpApiGateway", {
      vpc: vpc.vpc,
    });

    new cdk.CfnOutput(this, "apiUrl", {
      value: httpApi.url ? httpApi.url : "No URL found",
    });
  }
}
