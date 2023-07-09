import { deleteChannel, insertChannel } from "@/helpers/monogDbHelpers";
import { ChannelModel } from "@/models";
import { Channel } from "@/types";

// Critical to ensure proper database setup and teardown
import "./mongoTestSetup";

describe("MongoDB Channel Helper Functions", () => {
  const testChannel: Channel = {
    _id: "test",
    platform: "twitch",
  };

  beforeEach(async () => {
    const insertedChannel = await insertChannel({
      _id: testChannel._id,
      platform: testChannel.platform,
    });
    if (insertedChannel === null) {
      throw new Error("Error inserting test channel during setup");
    }
  });

  it("should insert a channel", async () => {
    const newChannel = await insertChannel({
      _id: "test2",
      platform: "youtube",
    });

    expect(newChannel).toHaveProperty("_id", "test2");
    expect(newChannel).toHaveProperty("platform", "youtube");
  });

  it("should update an existing channel", async () => {
    const updatedChannel = await insertChannel({
      _id: "test",
      platform: "youtube",
    });

    expect(updatedChannel).toHaveProperty("_id", "test");
    expect(updatedChannel).toHaveProperty("platform", "youtube");
  });

  it("should delete a channel", async () => {
    const deletedChannel = await deleteChannel(testChannel._id);

    expect(deletedChannel).toHaveProperty("_id", "test");
    expect(deletedChannel).toHaveProperty("platform", "twitch");

    const findDeleted = await ChannelModel.findById(testChannel._id);
    expect(findDeleted).toBeNull();
  });

  it("should not delete a non-existing channel", async () => {
    const deletedChannel = await deleteChannel("nonExistentId");

    expect(deletedChannel).toBeNull();
  });
});
