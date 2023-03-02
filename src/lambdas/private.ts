import { Handler } from "aws-lambda";
import { Client } from "pg";
import { databaseConfig } from "@/config";
import { selectAllFromTable } from "@/helpers";

export const handler: Handler = async function () {
  try {
    const client = new Client({
      user: databaseConfig.DATABASE_USER,
      host: databaseConfig.DATABASE_HOST,
      database: databaseConfig.DATABASE_NAME,
      password: databaseConfig.DATABASE_PASSWORD,
      port: 5432,
    });
    await client.connect();

    const users = await selectAllFromTable(client, "users");
    const channels = await selectAllFromTable(client, "channels");
    const savedChannels = await selectAllFromTable(client, "saved_channels");

    console.log(users.rows);

    console.log(channels.rows);

    console.log(savedChannels.rows);

    await client.end();

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(users.rows),
    };
  } catch (err) {
    console.log(err);

    return {
      statusCode: 500,
      headers: { "Content-Type": "text/plain" },
      body: "Welp, something went wrong",
    };
  }
};
