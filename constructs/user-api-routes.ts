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

interface UserRoutesProps {
  httpApi: HttpApi;
  authorizer: HttpJwtAuthorizer;
}

export const nodeJsFunctionProps: NodejsFunctionProps = {
  runtime: lambda.Runtime.NODEJS_16_X, // execution environment
};

export class UserApiRoutes extends Construct {
  constructor(scope: Construct, id: string, props: UserRoutesProps) {
    super(scope, id);

    const { httpApi, authorizer } = props;

    const upsertUser = new NodejsFunction(this, "UpsertUserHandler", {
      entry: join(__dirname, "/../lambdas", "registerUser.ts"),
      ...nodeJsFunctionProps,
    });

    const deleteUser = new NodejsFunction(this, "DeleteUserHandler", {
      entry: join(__dirname, "/../lambdas", "deleteUser.ts"),
      ...nodeJsFunctionProps,
    });

    const upsertUserIntegration = new HttpLambdaIntegration(
      "UpsertUserIntegration",
      upsertUser
    );

    const deleteUserIntegration = new HttpLambdaIntegration(
      "DeleteUserIntegration",
      deleteUser
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
  }
}
