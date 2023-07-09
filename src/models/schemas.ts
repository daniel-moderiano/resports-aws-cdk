import mongoose, { Document, Schema } from "mongoose";

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

const ChannelSchema = new Schema({
  _id: { type: String, required: true }, // This will be the YouTube or Twitch ID
  platform: { type: String, enum: ["youtube", "twitch"], required: true },
});

const UserSchema = new Schema({
  _id: { type: String, required: true }, // This will be the Auth0 ID
  email: { type: String, required: true, unique: true },
  email_verified: { type: Boolean, required: true },
  saved_channels: [{ type: String, ref: "Channel" }], // An array of references to Channel documents
});

export const ChannelModel = mongoose.model<ChannelDocument>(
  "Channel",
  ChannelSchema
);
export const UserModel = mongoose.model<UserDocument>("User", UserSchema);
