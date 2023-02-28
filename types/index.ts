import { Client, Pool } from "pg";

export interface APIRequestBody {
  user?: User;
}

// Database column/table type definitions. Expect these typings when interacting with database queries.
export interface Channel {
  channel_id: string;
  platform: "youtube" | "twitch";
}

export interface SavedChannel {
  user_id: string;
  channel_id: string;
}

export interface User {
  email: string;
  email_verified: boolean;
  user_id: string;
}

export type Database = Client | Pool;

export type Table = "users" | "channels" | "saved_channels";
