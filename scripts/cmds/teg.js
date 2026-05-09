 module.exports = {
 config: {
    name: "teg",
    version: "2.0",
    author: "Shahadat Islam × Modified by ChatGPT",
    countDown: 5,
    role: 2,
    shortDescription: {
      en: "Mention all members multiple times"
    },
    longDescription: {
      en: "Tag everyone in the group with custom repeat count"
    },
    category: "group",
    guide: {
      en: "{pn} [count]"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      const threadID = event.threadID;

      const threadInfo = await api.getThreadInfo(threadID);
      const memberIDs = threadInfo.participantIDs;

      const repeatCount = parseInt(args[0]) || 1;

      const botID = api.getCurrentUserID();

      const mentions = [];

      for (const id of memberIDs) {
        if (id != botID) {
          mentions.push({
            tag: "everyone",
            id: id
          });
        }
      }

      for (let i = 0; i < repeatCount; i++) {
        await api.sendMessage({
          body: "📢 @everyone\nসবাই চিপা থেকে বের হও 🐸",
          mentions
        }, threadID);

        await new Promise(resolve => setTimeout(resolve, 2000));
      }

    } catch (e) {
      console.log(e);
      api.sendMessage("❌ | Tag দিতে সমস্যা হয়েছে!", event.threadID);
    }
  }
};
