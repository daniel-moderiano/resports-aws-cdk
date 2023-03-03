#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ResportsAwsCdkStack } from "../lib/resports-aws-cdk-stack";
import { developmentEnv } from "./environment";

const app = new cdk.App();
new ResportsAwsCdkStack(app, "ResportsAwsCdkStack", {
  env: developmentEnv,
});
