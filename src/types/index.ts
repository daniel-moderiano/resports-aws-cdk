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
  optional,
} from "superstruct";

// Superstruct types for runtime type checking
export const ChannelStruct = object({
  _id: string(),
  platform: union([literal("youtube"), literal("twitch")]),
});

export const UserStruct = object({
  _id: string(),
  email: string(),
  email_verified: boolean(),
  saved_channels: optional(array(string())),
});

export const PopulatedUserStruct = object({
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

// Mongo document types
export interface ChannelDocument extends Document {
  _id: string;
  platform: string;
}

export interface UserDocument extends Document {
  _id: string;
  email: string;
  email_verified: boolean;
  saved_channels: ChannelDocument["_id"][];
}

export interface PopulatedUserDocument
  extends Omit<UserDocument, "saved_channels"> {
  saved_channels: ChannelDocument[];
}

export type Channel = Infer<typeof ChannelStruct>;
export type User = Infer<typeof UserStruct>;
export type PopulatedUser = Infer<typeof PopulatedUserStruct>;

export type Auth0AccessTokenResponse = Infer<typeof auth0AccessTokenResponse>;
