import { Client, Pool } from "pg";
import { Infer, boolean, literal, object, string, union } from "superstruct";

// Superstruct types for runtime type checking
export const ChannelStruct = object({
  channel_id: string(),
  platform: union([literal("youtube"), literal("twitch")]),
});

export const UserStruct = object({
  email: string(),
  email_verified: boolean(),
  user_id: string(),
});

export const SavedChannelStruct = object({
  user_id: string(),
  channel_id: string(),
});

export type Channel = Infer<typeof ChannelStruct>;
export type User = Infer<typeof UserStruct>;
export type SavedChannel = Infer<typeof SavedChannelStruct>;

export type Database = Client | Pool;

export type Table = "users" | "channels" | "saved_channels";
