import {
  selectSavedChannelsByUserId,
  insertSavedChannel,
  deleteSavedChannel,
  upsertUser,
  insertChannel,
} from "@/helpers/monogDbHelpers";

// Critical to ensure proper database setup and teardown
import "./mongoTestSetup";

describe("MongoDB SavedChannel Helper Functions", () => {
  const testUser = {
    _id: "testUser",
    email: "testEmail@test.com",
    email_verified: true,
  };

  const testChannel = {
    _id: "test",
    platform: "twitch",
  };

  beforeEach(async () => {
    const newUser = await upsertUser(testUser);
    expect(newUser).not.toBeNull();

    const insertedChannel = await insertChannel({
      _id: testChannel._id,
      platform: testChannel.platform,
    });

    expect(insertedChannel).not.toBeNull();
    await insertSavedChannel(testUser._id, testChannel._id);
  });

  it("should select all saved channels by a given user ID", async () => {
    const savedChannels = await selectSavedChannelsByUserId(testUser._id);
    expect(savedChannels).not.toBeNull();

    if (savedChannels) {
      expect(savedChannels.length).toBeGreaterThan(0);
      expect(savedChannels[0].channel_id).toEqual(testChannel._id);
    }
  });

  it("should insert a saved channel", async () => {
    const newChannel = await insertChannel({
      _id: "test2",
      platform: "testPlatform2",
    });

    expect(newChannel).not.toBeNull();

    if (newChannel) {
      await insertSavedChannel(testUser._id, newChannel._id);

      const savedChannels = await selectSavedChannelsByUserId(testUser._id);
      expect(savedChannels).not.toBeNull();

      if (savedChannels) {
        expect(
          savedChannels.some((channel) => channel.channel_id === newChannel._id)
        ).toBe(true);
      }
    }
  });

  it("should delete a saved channel", async () => {
    await deleteSavedChannel(testUser._id, testChannel._id);

    const savedChannels = await selectSavedChannelsByUserId(testUser._id);
    expect(savedChannels).not.toBeNull();

    if (savedChannels) {
      expect(
        savedChannels.some((channel) => channel.channel_id === testChannel._id)
      ).toBe(false);
    }
  });
});
