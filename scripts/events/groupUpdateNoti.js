module.exports = {
  config: {
    name: "groupupdate",
    version: "3.0.0",
    author: "ALVI × Modified By Ebrahim",
    role: 0,
    category: "events",
    shortDescription: {
      en: "Stylish group update notification"
    },
    longDescription: {
      en: "Shows stylish notifications for group updates with auto unsend"
    }
  },

  onEvent: async function ({ api, event, usersData }) {
    try {
      const { threadID, logMessageType, logMessageData, author } = event;

      // 🎀 Get User Name
      let authorName = "Unknown User";
      try {
        authorName = await usersData.getName(author);
      } catch (e) {}

      // ✨ Stylish Box
      const style = (title, content) => {
        return `
╭━━━〔 ${title} 〕━━━⬣
┃
┃ ${content}
┃
╰━━━━━━━━━━━━⬣`;
      };

      // ✅ Send & Auto Unsend
      async function send(msg) {
        const info = await api.sendMessage(msg, threadID);
        setTimeout(() => {
          api.unsendMessage(info.messageID);
        }, 5000);
      }

      // 📝 Group Name Change
      if (logMessageType == "log:thread-name") {
        return send(
          style(
            "📝 GROUP NAME UPDATED",
            `➤ New Name: ${logMessageData.name}\n┃ ➤ Changed By: ${authorName}`
          )
        );
      }

      // 📸 Group Photo Change
      if (logMessageType == "log:thread-image") {
        return send(
          style(
            "📸 GROUP PHOTO UPDATED",
            `➤ Group profile picture changed\n┃ ➤ Changed By: ${authorName}`
          )
        );
      }

      // ✏️ Nickname Change
      if (logMessageType == "log:user-nickname") {
        let targetName = "Unknown";
        try {
          targetName = await usersData.getName(logMessageData.participant_id);
        } catch (e) {}

        return send(
          style(
            "✏️ NICKNAME UPDATED",
            `➤ User: ${targetName}\n┃ ➤ New Nickname: ${logMessageData.nickname || "Removed"}\n┃ ➤ Changed By: ${authorName}`
          )
        );
      }

      // 👑 Admin Add / Remove
      if (logMessageType == "log:thread-admins") {
        let targetName = "Unknown";
        try {
          targetName = await usersData.getName(logMessageData.target_id);
        } catch (e) {}

        if (logMessageData.ADMIN_EVENT == "add_admin") {
          return send(
            style(
              "✅ NEW ADMIN ADDED",
              `➤ ${targetName} is now an Admin\n┃ ➤ Added By: ${authorName}`
            )
          );
        }

        if (logMessageData.ADMIN_EVENT == "remove_admin") {
          return send(
            style(
              "❌ ADMIN REMOVED",
              `➤ ${targetName} removed from admin\n┃ ➤ Removed By: ${authorName}`
            )
          );
        }
      }

      // 🌈 Theme Change
      if (logMessageType == "log:thread-color") {
        return send(
          style(
            "🌈 GROUP THEME UPDATED",
            `➤ Group theme color changed\n┃ ➤ Changed By: ${authorName}`
          )
        );
      }

      // 😀 Emoji Change
      if (logMessageType == "log:thread-emoji") {
        return send(
          style(
            "✨ GROUP EMOJI UPDATED",
            `➤ New Emoji: ${logMessageData.emoji}\n┃ ➤ Changed By: ${authorName}`
          )
        );
      }

      // ☎️ Call Started
      if (logMessageType == "call_started") {
        const callType = logMessageData.is_video_call
          ? "📹 Video Call"
          : "🎧 Audio Call";

        return send(
          style(
            "☎️ CALL STARTED",
            `➤ ${callType} started in group\n┃ ➤ Started By: ${authorName}`
          )
        );
      }

    } catch (err) {
      console.log("GroupUpdate Error:", err);
    }
  }
};
