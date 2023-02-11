#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ResportsAwsCdkStack } from "../lib/resports-aws-cdk-stack";
import { developmentEnvironment } from "../config/development-env";

const app = new cdk.App();
new ResportsAwsCdkStack(app, "ResportsAwsCdkStack", {
  env: developmentEnvironment,
});
