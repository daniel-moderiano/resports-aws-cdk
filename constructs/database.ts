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
import { Duration, SecretValue } from "aws-cdk-lib";
import { databaseConfig } from "../config/database";

interface DatabaseProps {
  vpc: Vpc;
  securityGroup: SecurityGroup;
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
      databaseName: "resportsDev",
      backupRetention: Duration.days(0),
      enablePerformanceInsights: true,
      allocatedStorage: 20,
      credentials: {
        username: "postgres",
        password: SecretValue.unsafePlainText(databaseConfig.DATABASE_PASSWORD),
      },
      securityGroups: [props.securityGroup],
    });

    this.database.connections.allowInternally;
  }
}
