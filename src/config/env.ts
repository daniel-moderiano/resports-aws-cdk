import "dotenv/config";
import { cleanEnv, str } from "envalid";

export const env = cleanEnv(process.env, {
  AWS_ACCOUNT: str(),
  AWS_REGION: str(),
});
