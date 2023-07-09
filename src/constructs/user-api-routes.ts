import { HttpMethod } from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";
import { SubnetType } from "aws-cdk-lib/aws-ec2";
import { databaseConfig } from "@/config";
import { Duration } from "aws-cdk-lib";
import { ApiRoutesProps } from "./http-api";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { auth0Config } from "@/config/auth0";

export class UserApiRoutes extends Construct {
  constructor(scope: Construct, id: string, props: ApiRoutesProps) {
    super(scope, id);

    const { httpApi, authorizer, vpc } = props;

    const nodeJsFunctionProps: NodejsFunctionProps = {
      runtime: Runtime.NODEJS_16_X,
      vpc: vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_ISOLATED },
      environment: databaseConfig,
      timeout: Duration.seconds(30),
    };

    const addUser = new NodejsFunction(this, "AddUserHandler", {
      entry: join(__dirname, "/../lambdas", "addUser.ts"),
      ...nodeJsFunctionProps,
    });

    const deleteUser = new NodejsFunction(this, "DeleteUserHandler", {
      entry: join(__dirname, "/../lambdas", "deleteUser.ts"),
      ...nodeJsFunctionProps,
    });

    const deleteAuth0User = new NodejsFunction(this, "DeleteAuth0UserHandler", {
      entry: join(__dirname, "/../lambdas", "deleteAuth0User.ts"),
      runtime: Runtime.NODEJS_16_X,
      environment: auth0Config,
    });

    const getUserSavedChannels = new NodejsFunction(
      this,
      "GetUserSavedChannelsHandler",
      {
        entry: join(__dirname, "/../lambdas", "getUserSavedChannels.ts"),
        ...nodeJsFunctionProps,
      }
    );

    const addUserIntegration = new HttpLambdaIntegration(
      "AddUserIntegration",
      addUser
    );

    const deleteUserIntegration = new HttpLambdaIntegration(
      "DeleteUserIntegration",
      deleteUser
    );

    const deleteAuth0UserIntegration = new HttpLambdaIntegration(
      "DeleteAuth0UserIntegration",
      deleteAuth0User
    );

    const getUserSavedChannelsIntegration = new HttpLambdaIntegration(
      "GetUserSavedChannelsIntegration",
      getUserSavedChannels
    );

    httpApi.addRoutes({
      path: "/users",
      methods: [HttpMethod.POST],
      integration: addUserIntegration,
      authorizer,
    });

    httpApi.addRoutes({
      path: "/users/{user_id}",
      methods: [HttpMethod.DELETE],
      integration: deleteUserIntegration,
      authorizer,
    });

    httpApi.addRoutes({
      path: "/users/auth0/{user_id}",
      methods: [HttpMethod.DELETE],
      integration: deleteAuth0UserIntegration,
      authorizer,
    });

    httpApi.addRoutes({
      path: "/users/{user_id}/saved-channels",
      methods: [HttpMethod.GET],
      integration: getUserSavedChannelsIntegration,
      authorizer,
    });
  }
}
