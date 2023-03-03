import { Handler } from "aws-lambda";
import { database } from "@/config";
import { selectAllFromTable } from "@/helpers";

export const handler: Handler = async function () {
  await database.connect();

  const users = await selectAllFromTable(database, "users");
  const channels = await selectAllFromTable(database, "channels");
  const savedChannels = await selectAllFromTable(database, "saved_channels");

  console.log(users.rows);
  console.log(channels.rows);
  console.log(savedChannels.rows);

  await database.end();

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: "Query successful, see logs for details",
  };
};
