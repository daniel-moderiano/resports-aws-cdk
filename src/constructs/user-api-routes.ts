import { HttpMethod } from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";
import { SubnetType } from "aws-cdk-lib/aws-ec2";
import { Duration } from "aws-cdk-lib";
import { ApiRoutesProps } from "./http-api";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { lambdaEnv } from "@/config/lambdaEnv";

export class UserApiRoutes extends Construct {
  constructor(scope: Construct, id: string, props: ApiRoutesProps) {
    super(scope, id);

    const { httpApi, authorizer, vpc } = props;

    const nodeJsFunctionProps: NodejsFunctionProps = {
      runtime: Runtime.NODEJS_16_X,
      vpc: vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
      environment: lambdaEnv,
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

    const addSavedChannel = new NodejsFunction(this, "AddSavedChannelHandler", {
      entry: join(__dirname, "/../lambdas", "addSavedChannel.ts"),
      ...nodeJsFunctionProps,
    });

    const deleteSavedChannel = new NodejsFunction(
      this,
      "DeleteSavedChannelHandler",
      {
        entry: join(__dirname, "/../lambdas", "deleteSavedChannel.ts"),
        ...nodeJsFunctionProps,
      }
    );

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

    const addSavedChannelIntegration = new HttpLambdaIntegration(
      "AddSavedChannelIntegration",
      addSavedChannel
    );

    const deleteSavedChannelIntegration = new HttpLambdaIntegration(
      "DeleteSavedChannelIntegration",
      deleteSavedChannel
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

    httpApi.addRoutes({
      path: "/users/{userId}/saved-channels",
      methods: [HttpMethod.POST],
      integration: addSavedChannelIntegration,
      authorizer,
    });

    httpApi.addRoutes({
      path: "/users/{userId}/saved-channels/{channelId}",
      methods: [HttpMethod.DELETE],
      integration: deleteSavedChannelIntegration,
      authorizer,
    });
  }
}
