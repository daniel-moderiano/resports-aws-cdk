import { Handler } from "aws-lambda";
import { databaseClientConfig } from "@/config";
import { createNewTables, dropExistingTables } from "@/helpers";
import { Client } from "pg";

export const handler: Handler = async function () {
  const database = new Client({ ...databaseClientConfig });
  await database.connect();

  await dropExistingTables(database);
  await createNewTables(database);

  await database.end();

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: "Database initialised",
  };
};
