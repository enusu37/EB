module.exports = {
  config: {
    name: "groupupdate",
    version: "2.0",
    author: "Ebrahim",
    role: 0,
    category: "events",
    shortDescription: {
      en: "Stylish Group Update Notification"
    },
    longDescription: {
      en: "Notify all group updates with auto unsend"
    }
  },

  onEvent: async function ({ api, event, usersData }) {
    try {
      const { threadID, logMessageType, logMessageData, author } = event;

      // ✅ Supported Events
      const allowedEvents = [
        "log:thread-name",
        "log:thread-image",
        "log:user-nickname",
        "log:thread-admins",
        "log:thread-color",
        "log:thread-emoji"
      ];

      if (!allowedEvents.includes(logMessageType)) return;

      // 👤 Author Name
      let authorName = "Unknown";
      try {
        authorName = await usersData.getName(author);
      } catch (e) {}

      // 📩 Send + Auto Unsend
      const sendMsg = async (msg) => {
        const info = await api.sendMessage(msg, threadID);

        setTimeout(() => {
          api.unsendMessage(info.messageID);
        }, 5000);
      };

      // 📝 Group Name Change
      if (logMessageType === "log:thread-name") {
        return sendMsg(
`╭━━━〔 📝 GROUP NAME UPDATED 〕━━━⬣
┃ ➤ New Name: ${logMessageData.name}
┃ ➤ Changed By: ${authorName}
╰━━━━━━━━━━━━⬣`
        );
      }

      // 📸 Group Photo Change
      if (logMessageType === "log:thread-image") {
        return sendMsg(
`╭━━━〔 📸 GROUP PHOTO UPDATED 〕━━━⬣
┃ ➤ Group profile picture changed
┃ ➤ Changed By: ${authorName}
╰━━━━━━━━━━━━⬣`
        );
      }

      // ✏️ Nickname Change
      if (logMessageType === "log:user-nickname") {

        const uid =
          logMessageData.participant_id ||
          logMessageData.participantFbId;

        let targetName = "Unknown";

        try {
          targetName = await usersData.getName(uid);
        } catch (e) {}

        return sendMsg(
`╭━━━〔 ✏️ NICKNAME UPDATED 〕━━━⬣
┃ ➤ User: ${targetName}
┃ ➤ New Nickname: ${logMessageData.nickname || "Removed"}
┃ ➤ Changed By: ${authorName}
╰━━━━━━━━━━━━⬣`
        );
      }

      // 👑 Admin Add/Remove
      if (logMessageType === "log:thread-admins") {

        const uid =
          logMessageData.target_id ||
          logMessageData.targetFbId;

        let targetName = "Unknown";

        try {
          targetName = await usersData.getName(uid);
        } catch (e) {}

        // ✅ Add Admin
        if (logMessageData.ADMIN_EVENT === "add_admin") {
          return sendMsg(
`╭━━━〔 👑 NEW ADMIN ADDED 〕━━━⬣
┃ ➤ ${targetName} is now an admin
┃ ➤ Added By: ${authorName}
╰━━━━━━━━━━━━⬣`
          );
        }

        // ❌ Remove Admin
        if (logMessageData.ADMIN_EVENT === "remove_admin") {
          return sendMsg(
`╭━━━〔 ❌ ADMIN REMOVED 〕━━━⬣
┃ ➤ ${targetName} removed from admin
┃ ➤ Removed By: ${authorName}
╰━━━━━━━━━━━━⬣`
          );
        }
      }

      // 🌈 Theme Change
      if (logMessageType === "log:thread-color") {
        return sendMsg(
`╭━━━〔 🌈 GROUP THEME UPDATED 〕━━━⬣
┃ ➤ Group theme changed
┃ ➤ Changed By: ${authorName}
╰━━━━━━━━━━━━⬣`
        );
      }

      // 😀 Emoji Change
      if (logMessageType === "log:thread-emoji") {
        return sendMsg(
`╭━━━〔 😀 GROUP EMOJI UPDATED 〕━━━⬣
┃ ➤ New Emoji: ${logMessageData.emoji}
┃ ➤ Changed By: ${authorName}
╰━━━━━━━━━━━━⬣`
        );
      }

    } catch (err) {
      console.log("GroupUpdate Error:", err);
    }
  }
};
