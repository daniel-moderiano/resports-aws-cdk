import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { VPC, PostgresDatabase, APIGateway } from "@/constructs";
import { databaseConfig } from "@/config";
import { SubnetType } from "aws-cdk-lib/aws-ec2";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { join } from "path";
import { Duration } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";

export class ResportsAwsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new VPC(this, "VPC");

    new PostgresDatabase(this, "ResportsDatabase", {
      vpc: vpc.vpc,
      securityGroup: vpc.securityGroup,
    });

    // Database initialiser lambda. Should be called manually via CLI or console as this WILL erase the database
    new NodejsFunction(this, "DatabaseInitialiser", {
      entry: join(__dirname, "../src/lambdas", "initialiseDatabase.ts"),
      vpc: vpc.vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_ISOLATED },
      environment: databaseConfig,
      timeout: Duration.seconds(30),
      runtime: Runtime.NODEJS_16_X,
    });

    const httpApi = new APIGateway(this, "HttpApiGateway", {
      vpc: vpc.vpc,
    });

    new cdk.CfnOutput(this, "apiUrl", {
      value: httpApi.url ? httpApi.url : "No URL found",
    });
  }
}
