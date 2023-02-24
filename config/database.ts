import * as dotenv from "dotenv";
dotenv.config();

import { cleanEnv, str } from "envalid";

export const env = cleanEnv(process.env, {
  DATABASE_USER: str(),
  DATABASE_PASSWORD: str(),
  DATABASE_NAME: str(),
  DATABASE_HOST: str(),
  AWS_ACCOUNT: str(),
  AWS_REGION: str(),
});
