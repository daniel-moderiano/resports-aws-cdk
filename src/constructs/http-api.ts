import { CorsHttpMethod, HttpApi } from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpJwtAuthorizer } from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";
import { Construct } from "constructs";
import { UserApiRoutes } from "./user-api-routes";
import { Vpc } from "aws-cdk-lib/aws-ec2";

interface APIGatewayProps {
  vpc: Vpc;
}

export interface ApiRoutesProps {
  httpApi: HttpApi;
  authorizer: HttpJwtAuthorizer;
  vpc: Vpc;
}

export class APIGateway extends Construct {
  public url: string | undefined;

  constructor(scope: Construct, id: string, props: APIGatewayProps) {
    super(scope, id);

    // defines an API Gateway HTTP API resource
    const httpApi = new HttpApi(this, "HttpApi", {
      corsPreflight: {
        allowHeaders: ["Authorization", "Content-Type"],
        allowMethods: [
          CorsHttpMethod.GET,
          CorsHttpMethod.POST,
          CorsHttpMethod.DELETE,
          CorsHttpMethod.PUT,
        ],
        allowOrigins: ["*"],
      },
    });
    this.url = httpApi.url;

    // Define a JWT authorizer configured to accept Auth0 JWTs from a pre-specified Auth0 API
    const authorizer = new HttpJwtAuthorizer(
      "Auth0JwtAuthorizer",
      "https://dev-c0yb5cr7.us.auth0.com/",
      {
        jwtAudience: ["https://auth0-jwt-authorizer"],
        identitySource: ["$request.header.Authorization"],
      }
    );

    new UserApiRoutes(this, "UserApiRoutes", {
      httpApi,
      authorizer,
      vpc: props.vpc,
    });
  }
}
