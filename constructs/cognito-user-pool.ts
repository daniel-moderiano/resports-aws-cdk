import { Construct } from "constructs";
import * as cognito from "aws-cdk-lib/aws-cognito";
import { Duration } from "aws-cdk-lib";

export class CognitoUserPool extends Construct {
  readonly userPoolId: string;
  readonly userPoolClientId: string;

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

      // Configure the attributes that you want to keep active when an update to their value is pending. Your users can receive messages and sign in with the original attribute value until they verify the new value.
      keepOriginal: {
        email: true,
      },

      // Users must provide full name on sign-up, but cannot change it thereafter
      standardAttributes: {
        fullname: {
          required: true,
          mutable: false,
        },
        email: {
          required: true,
          mutable: true,
        },
      },

      // Users can opt-in to MFA, but only TOTP apps are avaiable as an authentication method
      mfa: cognito.Mfa.OPTIONAL,
      mfaSecondFactor: {
        sms: false,
        otp: true,
      },

      // TODO: customise password policy
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
        tempPasswordValidity: Duration.days(7),
      },

      deletionProtection: true,

      // TODO: post-confirmation lambda triggers

      // Adjust default account recovery to use email only, not SMS
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
    });

    // Configure the App Client
    const appClient = userPool.addClient("DemoAppClient", {
      userPoolClientName: "test-app-client",
    });

    // Configure the Cognito hosted domain where the auth sign-up/log-in pages will be hosted.
    const domain = userPool.addDomain("DemoUserPoolDomain", {
      cognitoDomain: {
        domainPrefix: "resports-demo-app",
      },
    });

    this.userPoolId = userPool.userPoolId;
    this.userPoolClientId = appClient.userPoolClientId;
  }
}
