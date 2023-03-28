import { Client, Pool } from "pg";
import {
  Infer,
  boolean,
  literal,
  object,
  string,
  union,
  number,
} from "superstruct";

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

export const auth0AccessTokenResponse = object({
  access_token: string(),
  scope: string(),
  expires_in: number(),
  token_type: string(),
});

export type Channel = Infer<typeof ChannelStruct>;
export type User = Infer<typeof UserStruct>;
export type SavedChannel = Infer<typeof SavedChannelStruct>;

export type Database = Client | Pool;

export type Table = "users" | "channels" | "saved_channels";

export type Auth0AccessTokenResponse = Infer<typeof auth0AccessTokenResponse>;

// Defined using the JSend specification, see https://github.com/omniti-labs/jsend
export type SuccessResponse = {
  status: "success";
  data: Record<string, unknown> | null;
};

export type FailResponse = {
  status: "fail";
  data: Record<string, unknown>;
};

export type ErrorResponse = {
  status: "error";
  message: string;
  code?: number;
  data?: string;
};
