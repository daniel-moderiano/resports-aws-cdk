import { Handler } from "aws-lambda";
import { database } from "@/config";
import { createNewTables, dropExistingTables } from "@/helpers";

export const handler: Handler = async function () {
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
