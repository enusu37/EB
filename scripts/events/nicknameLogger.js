module.exports = {
  config: {
    name: "nicknameLogger",
    version: "1.3",
    author: "Farhan-Khan",
    category: "system"
  },

  onEvent: async function ({ api, event, Users }) {
    const { threadID, logMessageType, logMessageData } = event;

    // শুধু nickname change event
    if (
      logMessageType !== "log:thread-nickname" &&
      logMessageType !== "log:user-nickname"
    ) return;

    try {
      const userID =
        logMessageData?.participant_id ||
        logMessageData?.author;

      if (!userID) return;

      const newNick = logMessageData?.nickname || "No Nickname";

      let name = "User";
      try {
        name = await Users.getNameUser(userID);
      } catch (e) {}

      return api.sendMessage(
        `🔔 𝗡𝗶𝗰𝗸𝗻𝗮𝗺𝗲 𝗖𝗵𝗮𝗻𝗴𝗲 𝗗𝗲𝘁𝗲𝗰𝘁𝗲𝗱\n\n👤 Name: ${name}\n🆔 UID: ${userID}\n✨ New Nick: ${newNick}\n\n🐸 এই গরীব তোরা nickname চেঞ্জ করবি না!`,
        threadID
      );

    } catch (err) {
      console.error("Nickname logger error:", err);
    }
  }
};
