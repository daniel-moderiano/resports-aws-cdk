import { Construct } from "constructs";
import { DatabaseInstance } from "aws-cdk-lib/aws-rds";

export class PostgresDatabase extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}
