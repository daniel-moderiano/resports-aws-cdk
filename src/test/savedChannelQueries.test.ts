import {
  addSavedChannel,
  deleteSavedChannel,
  getSavedChannels,
  upsertUser,
} from "@/helpers";
import { Channel } from "@/types";

// Critical to ensure proper database setup and teardown
import "./mongoTestSetup";

describe("User and Channel helpers", () => {
  const testUserId = "testUser";

  const testChannel: Channel = {
    channel_id: "1234",
    platform: "twitch",
  };

  beforeEach(async () => {
    await upsertUser({
      _id: testUserId,
      email: "user@example.com",
      email_verified: true,
    });

    await addSavedChannel(testUserId, testChannel);
  });

  it("should get all saved channels for a user", async () => {
    const savedChannels = await getSavedChannels(testUserId);
    expect(savedChannels).toHaveLength(1);
    expect(savedChannels[0].channel_id).toEqual(testChannel.channel_id);
  });

  it("should not add duplicate saved channels", async () => {
    await addSavedChannel(testUserId, testChannel);
    const savedChannels = await getSavedChannels(testUserId);
    expect(savedChannels).toHaveLength(1);
  });

  it("should add a saved channel for a user", async () => {
    await addSavedChannel(testUserId, {
      channel_id: "5678",
      platform: "youtube",
    });
    const savedChannels = await getSavedChannels(testUserId);
    expect(savedChannels).toHaveLength(2);
    const hasChannel = savedChannels.some(
      (channel) => channel.channel_id === "5678"
    );
    expect(hasChannel).toBe(true);
  });

  it("should delete a saved channel from a user", async () => {
    await deleteSavedChannel(testUserId, testChannel.channel_id);
    const savedChannels = await getSavedChannels(testUserId);
    expect(savedChannels).toHaveLength(0);
  });
});
