import { APIGatewayProxyEventV2, Handler } from "aws-lambda";
import { is, object, string } from "superstruct";
import { deleteChannel } from "../helpers/databaseQueries";
import { Client } from "pg";
import { databaseConfig } from "../config/database";

const ChannelIdStruct = object({
  channel_id: string(),
});

export const handler: Handler = async function (event: APIGatewayProxyEventV2) {
  if (!event.body) {
    return JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "Bad request. Missing request body.",
      },
    });
  }

  const channelInfo = JSON.parse(event.body);

  if (!is(channelInfo, ChannelIdStruct)) {
    return JSON.stringify({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "Bad request. Invalid channel information.",
      },
    });
  }

  const client = new Client({
    user: databaseConfig.DATABASE_USER,
    host: databaseConfig.DATABASE_HOST,
    database: databaseConfig.DATABASE_NAME,
    password: databaseConfig.DATABASE_PASSWORD,
    port: 5432,
  });

  // The following code will throw a generic 500 internal server error. We might consider a try/catch, but I don't think we would handle the error any differently
  await client.connect();

  const result = await deleteChannel(client, channelInfo.channel_id);

  await client.end();

  return JSON.stringify({
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: {
      message:
        result.rowCount === 0
          ? "No existing channel to delete"
          : `Channel ${channelInfo.channel_id} deleted.`,
    },
  });
};
