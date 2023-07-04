/**
 * import { Document } from "mongoose";
import {
  Infer,
  boolean,
  literal,
  object,
  string,
  union,
  number,
  array,
} from "superstruct";

// Superstruct types for runtime type checking
export const ChannelStruct = object({
  _id: string(),
  platform: union([literal("youtube"), literal("twitch")]),
});

export const SavedChannelStruct = object({
  channel_id: string(),
});

export const UserStruct = object({
  _id: string(),
  email: string(),
  email_verified: boolean(),
  saved_channels: array(SavedChannelStruct)
});

export const auth0AccessTokenResponse = object({
  access_token: string(),
  scope: string(),
  expires_in: number(),
  token_type: string(),
});

// Mongo document types
export interface ChannelDocument extends Document {
  _id: string;
  platform: string;
}

export interface UserDocument extends Document {
  _id: string;
  email: string;
  email_verified: boolean;
  saved_channels: SavedChannel[];
}

export interface SavedChannelDocument extends Document {
  channel_id: string;
}

export type Channel = Infer<typeof ChannelStruct>;
export type User = Infer<typeof UserStruct>;
export type SavedChannel = Infer<typeof SavedChannelStruct>;

export type TableName = "users" | "channels" | "saved_channels";

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

 * 
 */