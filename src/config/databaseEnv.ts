import "dotenv/config";
import { cleanEnv, str } from "envalid";

const env = cleanEnv(process.env, {
  MONGO_URI: str(),
});

export const databaseConfig = {
  MONGO_URI: env.MONGO_URI,
};
