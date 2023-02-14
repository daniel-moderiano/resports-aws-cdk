import { Construct } from "constructs";
import * as cognito from "aws-cdk-lib/aws-cognito";

export class CognitoUserPool extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const userPool = new cognito.UserPool(this, "TestUserPool", {
      userPoolName: "test-user-pool",
      signInCaseSensitive: false, // case insensitive is preferred in most situations

      // Allow self sign up, else users could only be signed up by an administrator
      selfSignUpEnabled: true,

      // Allow users to sign in with either username or email
      signInAliases: {
        username: true,
        email: true,
      },

      // Users must provide full name on sign-up, but cannot change it thereafter
      standardAttributes: {
        fullname: {
          required: true,
          mutable: false,
        },
      },

      // Users can opt-in to MFA, but only TOTP apps are avaiable as an authentication method
      mfa: cognito.Mfa.OPTIONAL,
      mfaSecondFactor: {
        sms: false,
        otp: true,
      },
    });
  }
}
