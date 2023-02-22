import { Construct } from "constructs";
import {
  DatabaseInstance,
  DatabaseInstanceEngine,
  PostgresEngineVersion,
} from "aws-cdk-lib/aws-rds";
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  SecurityGroup,
  SubnetType,
  Vpc,
} from "aws-cdk-lib/aws-ec2";
import { Duration } from "aws-cdk-lib";

interface DatabaseProps {
  vpc: Vpc;
  securityGroup?: SecurityGroup;
}

export class PostgresDatabase extends Construct {
  public database: DatabaseInstance;

  constructor(scope: Construct, id: string, props: DatabaseProps) {
    super(scope, id);

    const { vpc } = props;

    this.database = new DatabaseInstance(this, "ResportsDatabase", {
      engine: DatabaseInstanceEngine.postgres({
        version: PostgresEngineVersion.VER_13_7,
      }),
      vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_ISOLATED },
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
      port: 5432,
      databaseName: "resports-dev",
      backupRetention: Duration.days(0),
    });

    this.database.connections.allowInternally;
  }
}
