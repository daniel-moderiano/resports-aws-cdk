import { Construct } from "constructs";
import * as cognito from "aws-cdk-lib/aws-cognito";

export class CognitoUserPool extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const userPool = new cognito.UserPool(this, "TestUserPool", {
      userPoolName: "test-user-pool",
      signInCaseSensitive: false, // case insensitive is preferred in most situations
    });
  }
}
