import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  VPC,
  PostgresDatabase,
  APIGateway,
  DatabaseInitialiseLambda,
} from "@/constructs";

export class ResportsAwsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new VPC(this, "VPC");

    new PostgresDatabase(this, "ResportsDatabase", {
      vpc: vpc.vpc,
      securityGroup: vpc.securityGroup,
    });

    new DatabaseInitialiseLambda(this, "DatabaseInitialiseLambda", {
      vpc: vpc.vpc,
    });

    const httpApi = new APIGateway(this, "HttpApiGateway", {
      vpc: vpc.vpc,
    });

    new cdk.CfnOutput(this, "apiUrl", {
      value: httpApi.url ? httpApi.url : "No URL found",
    });
  }
}
