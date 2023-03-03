import { Construct } from "constructs";
import { SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { join } from "path";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Duration } from "aws-cdk-lib";
import { databaseConfig } from "@/config";
import { Runtime } from "aws-cdk-lib/aws-lambda";

interface DatabaseInitialiseLambdaProps {
  vpc: Vpc;
}

export class DatabaseInitialiseLambda extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: DatabaseInitialiseLambdaProps
  ) {
    super(scope, id);

    // Database initialiser lambda. Should be called manually via CLI or console as this WILL erase the database
    new NodejsFunction(this, "DatabaseInitialiser", {
      entry: join(__dirname, "/../lambdas", "initialiseDatabase.ts"),
      vpc: props.vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_ISOLATED },
      environment: databaseConfig,
      timeout: Duration.seconds(30),
      runtime: Runtime.NODEJS_16_X,
    });
  }
}
