import { Construct } from "constructs";
import { SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { join } from "path";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Duration } from "aws-cdk-lib";
import { databaseConfig } from "@/config";
import { Runtime } from "aws-cdk-lib/aws-lambda";

interface DatabaseOverviewLambdaProps {
  vpc: Vpc;
}

export class DatabaseOverviewLambda extends Construct {
  public lambda: NodejsFunction;

  constructor(
    scope: Construct,
    id: string,
    props: DatabaseOverviewLambdaProps
  ) {
    super(scope, id);

    this.lambda = new NodejsFunction(this, "DatabaseOverviewLambda", {
      entry: join(__dirname, "/../lambdas", "databaseOverview.ts"),
      runtime: Runtime.NODEJS_16_X,
      vpc: props.vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_ISOLATED },
      environment: databaseConfig,
      timeout: Duration.seconds(30),
    });
  }
}
