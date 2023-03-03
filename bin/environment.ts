import "dotenv/config";
import { cleanEnv, str } from "envalid";

const env = cleanEnv(process.env, {
  AWS_DEV_ACCOUNT: str(),
  AWS_DEV_REGION: str(),
});

export const developmentEnv = {
  account: env.AWS_DEV_ACCOUNT,
  region: env.AWS_DEV_REGION,
};
