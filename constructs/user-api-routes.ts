import { HttpApi, HttpMethod } from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpJwtAuthorizer } from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { databaseConfig } from "../config/database";
import { Duration } from "aws-cdk-lib";

interface UserRoutesProps {
  httpApi: HttpApi;
  authorizer: HttpJwtAuthorizer;
  vpc: Vpc;
}

export class UserApiRoutes extends Construct {
  constructor(scope: Construct, id: string, props: UserRoutesProps) {
    super(scope, id);

    const { httpApi, authorizer, vpc } = props;

    const nodeJsFunctionProps: NodejsFunctionProps = {
      runtime: lambda.Runtime.NODEJS_16_X,
      vpc: vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_ISOLATED },
      environment: databaseConfig,
      timeout: Duration.seconds(30),
    };

    const upsertUser = new NodejsFunction(this, "UpsertUserHandler", {
      entry: join(__dirname, "/../lambdas", "upsertUser.ts"),
      ...nodeJsFunctionProps,
    });

    const deleteUser = new NodejsFunction(this, "DeleteUserHandler", {
      entry: join(__dirname, "/../lambdas", "deleteUser.ts"),
      ...nodeJsFunctionProps,
    });

    const getUserSavedChannels = new NodejsFunction(
      this,
      "GetUserSavedChannelsHandler",
      {
        entry: join(__dirname, "/../lambdas", "getUserSavedChannels.ts"),
        ...nodeJsFunctionProps,
      }
    );

    const upsertUserIntegration = new HttpLambdaIntegration(
      "UpsertUserIntegration",
      upsertUser
    );

    const deleteUserIntegration = new HttpLambdaIntegration(
      "DeleteUserIntegration",
      deleteUser
    );

    const getUserSavedChannelsIntegration = new HttpLambdaIntegration(
      "GetUserSavedChannelsIntegration",
      getUserSavedChannels
    );

    httpApi.addRoutes({
      path: "/users/{userId}",
      methods: [HttpMethod.POST],
      integration: upsertUserIntegration,
      authorizer,
    });

    httpApi.addRoutes({
      path: "/users/{userId}",
      methods: [HttpMethod.DELETE],
      integration: deleteUserIntegration,
      authorizer,
    });

    httpApi.addRoutes({
      path: "/users/{userId}/saved-channels",
      methods: [HttpMethod.GET],
      integration: getUserSavedChannelsIntegration,
      authorizer,
    });
  }
}
