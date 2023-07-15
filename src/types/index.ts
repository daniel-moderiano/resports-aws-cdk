import { Document } from "mongoose";
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

export const ChannelStruct = object({
  channel_id: string(),
  platform: union([literal("youtube"), literal("twitch")]),
});

export const UserStruct = object({
  _id: string(),
  email: string(),
  email_verified: boolean(),
  saved_channels: array(ChannelStruct),
});

export const auth0AccessTokenResponse = object({
  access_token: string(),
  scope: string(),
  expires_in: number(),
  token_type: string(),
});

export interface UserDocument extends Document {
  _id: string;
  email: string;
  email_verified: boolean;
  saved_channels: Channel[];
}

export type Channel = Infer<typeof ChannelStruct>;
export type User = Infer<typeof UserStruct>;
export type Auth0AccessTokenResponse = Infer<typeof auth0AccessTokenResponse>;
