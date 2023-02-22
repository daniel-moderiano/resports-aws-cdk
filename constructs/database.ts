import { Construct } from "constructs";
import {
  DatabaseInstance,
  DatabaseInstanceEngine,
  PostgresEngineVersion,
} from "aws-cdk-lib/aws-rds";
import { InstanceClass, InstanceSize, InstanceType } from "aws-cdk-lib/aws-ec2";

export class PostgresDatabase extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Define required database parameters
    const engine = DatabaseInstanceEngine.postgres({
      version: PostgresEngineVersion.VER_13_7,
    });
    const instanceType = InstanceType.of(InstanceClass.T3, InstanceSize.MICRO);
    const port = 5432;
    const databaseName = "resports-dev";
  }
}
