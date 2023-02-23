import { Construct } from "constructs";
import { Duration, triggers } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { join } from "path";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { env } from "../config/database";

interface InitialiserProps {
  databaseContstruct: Construct;
  vpc: Vpc;
}

export class DatabaseInitialiseTrigger extends Construct {
  constructor(scope: Construct, id: string, props: InitialiserProps) {
    super(scope, id);

    const upsertUser = new NodejsFunction(this, "DatabaseInitialiser", {
      entry: join(__dirname, "/../lambdas", "initialiseDatabase.ts"),
      vpc: props.vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_ISOLATED },
      environment: {
        DATABASE_HOST: env.DATABASE_HOST,
        DATABASE_NAME: env.DATABASE_NAME,
        DATABASE_PASSWORD: env.DATABASE_PASSWORD,
        DATABASE_USER: env.DATABASE_USER,
      },
      timeout: Duration.seconds(30),
      runtime: lambda.Runtime.NODEJS_16_X,
    });

    const trigger = new triggers.Trigger(this, "DatabaseInitialiseTrigger", {
      handler: upsertUser,
      executeAfter: [props.databaseContstruct],
      executeOnHandlerChange: true,
    });
  }
}
