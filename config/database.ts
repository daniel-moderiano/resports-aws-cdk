require("dotenv").config();
import { cleanEnv, str } from "envalid";

export const env = cleanEnv(process.env, {
  DATABASE_USE: str(),
  DATABASE_PASSWORD: str(),
  DATABASE_NAME: str(),
});
