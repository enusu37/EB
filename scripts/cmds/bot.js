const axios = require('axios');

// Fetching dynamic API URL from GitHub
const getBaseApiUrl = async () => {
    try {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
    } catch (e) {
        return "https://noobs-api.top"; // Fallback URL
    }
};

// শুধু "bot" ট্রিগার হিসেবে থাকবে
const triggerWords = ["bot"];

const LOCKED_AUTHOR = "FARHAN-KHAN";

module.exports = {
    config: {
        name: "bot",
        aliases: ["Bot", "বট"],
        version: "11.1.0",
        author: "FARHAN-KHAN", // 🔒 LOCKED AUTHOR
        countDown: 0,
        role: 0,
        description: "Bot responds only to 'bot' trigger with funny dialogues or AI.",
        category: "fun",
        guide: { 
            en: "{pn} [text]\n{pn} teach [q] - [a]\n{pn} list" 
        }
    },

    onStart: async function ({ api, event, args, usersData, commandName }) {
        const { threadID, messageID, senderID } = event;
        const baseUrl = await getBaseApiUrl();

        try {
            const name = await usersData.getName(senderID);

            if (!args[0]) {
                return api.sendMessage({
                    body: `𓆩» ${name} «𓆪\nবলুন আমি "বট" আপনাকে কিভাবে সাহায্য করতে পারি? 😘`,
                    mentions: [{ tag: name, id: senderID }]
                }, threadID, (err, info) => {
                    if (!err) global.GoatBot?.onReply?.set(info.messageID, { commandName, author: senderID });
                }, messageID);
            }

            const action = args[0].toLowerCase();

            if (action === "teach") {
                const input = args.slice(1).join(" ");
                const [trigger, ...responsesArr] = input.split(" - ");
                const responses = responsesArr.join(" - ");
                if (!trigger || !responses) return api.sendMessage("⚠️ Format: teach ask - reply", threadID, messageID);

                const res = await axios.post(`${baseUrl}/api/jan/teach`, {
                    trigger,
                    responses,
                    userID: senderID
                });

                return api.sendMessage(`✅ Added: ${trigger} -> ${responses}`, threadID, messageID);
            }

            // Default AI Response
            const res = await axios.post(`${baseUrl}/api/hinata`, { 
                text: args.join(" "), 
                style: 3, 
                attachments: event.attachments || [] 
            });

            return api.sendMessage(res.data.message, threadID, (err, info) => {
                if (!err) global.GoatBot?.onReply?.set(info.messageID, { commandName, author: senderID });
            }, messageID);

        } catch (err) {
            return api.sendMessage("API Busy! ❌", threadID, messageID);
        }
    },

    onReply: async function ({ api, event, commandName }) {
        if (api.getCurrentUserID() == event.senderID) return;

        try {
            const baseUrl = await getBaseApiUrl();
            const res = await axios.post(`${baseUrl}/api/hinata`, { 
                text: event.body?.toLowerCase() || "hi", 
                style: 3, 
                attachments: event.attachments || [] 
            });

            return api.sendMessage(res.data.message, event.threadID, (err, info) => {
                if (!err) global.GoatBot?.onReply?.set(info.messageID, { commandName, author: event.senderID });
            }, event.messageID);

        } catch (err) {}
    },

    onChat: async function ({ api, event, usersData, commandName }) {
        const { body, senderID, threadID, messageID } = event;
        if (!body) return;

        const lowerBody = body.toLowerCase();

        // চেক করবে মেসেজটি "bot" দিয়ে শুরু হয়েছে কি না
        if (triggerWords.some(word => lowerBody.startsWith(word))) {
            const text = body.replace(/^bot\s*/i, "").trim();

            if (!text) {
                const name = await usersData.getName(senderID);

                const randomReplies = ["ʙᴀʙʏ, ᴀᴍɪ ᴛᴏᴍᴀʀ ᴏᴘᴇᴋʜʏᴀʏ ᴄʜɪʟᴀᴍ 💖",
    "ᴋɪ ᴋᴏʀᴛᴇᴄʜᴏ ʙᴀʙʏ? 😍",
    "ᴍɪꜱꜱ ᴋᴏʀᴇᴄʜᴏ ᴀᴍᴀᴋᴇ? 🥰",
    "ʏᴇꜱ ʙᴀʙʏ, ᴀᴍɪ ʟɪꜱᴛᴇɴɪɴɢ 👂",
    "ʙᴀʙʏʏʏ~ ᴛᴜᴍɪ ᴀᴍᴀᴋᴇ ᴄᴀʟʟ ᴋᴏʀᴇᴄʜᴏ? 💌",
    "ᴏᴡᴡ ʙᴀʙʏ, ᴛᴜᴍɪ ᴏɴᴇᴋ ᴄᴜᴛᴇ 💕",
    "ʜᴇʏ ʟᴏᴠᴇʀʙᴏʏ/ʟᴏᴠᴇʀɢɪʀʟ 💞",
    "ᴋɪ ᴅᴏᴋᴛᴇ ʙᴀʙʏ~ ᴀᴍɪ ᴀᴄʜɪ 💗",
    "ʙᴀʙʏ, ᴛᴜᴍɪ ᴀᴍᴀʀ ꜱᴘᴇᴄɪᴀʟ ❤️",
    "ʙᴀʙʏ, ᴛᴜᴍɪ ᴄᴀʟʟ ᴋᴏʀʟᴇ ᴀᴍɪ ʀᴜɴ ᴋᴏʀᴇ ᴀꜱʜɪ 😚",
    "ᴀᴍᴀʀ ꜱʜᴏɴᴀ ʙᴀʙʏ ᴋᴏᴛʜᴀʏ ᴄʜɪʟᴏ 💖",
    "ʙᴀʙʏ, ᴛᴏᴍᴀʀ ᴍᴇꜱꜱᴀɢᴇ ᴅᴇᴋʜᴇ ʜᴇᴀʀᴛ ʜᴀᴘᴘʏ 💕",
    "ᴛᴜᴍɪ ᴄᴀʟʟ ᴋᴏʀʟᴇ ᴀᴍɪ ꜱᴍɪʟᴇ ᴋᴏʀɪ 😍",
    "ʙᴀʙʏ, ᴀᴍɪ ᴀᴄʜɪ ᴛᴏᴍᴀʀ ᴊᴏɴɴᴏ ʜᴍᴍ 💗",
    "ᴏʏᴇ ʙᴀʙʏ, ᴛᴜᴍɪ ᴀᴍᴀʀ ꜱᴡᴇᴇᴛ ᴘʀᴏʙʟᴇᴍ 😜",
    "ʙᴀʙʏ, ᴀᴍɪ ᴀᴄʜɪ ᴊᴜꜱᴛ ꜰᴏʀ ʏᴏᴜ 😚",
    "ᴛᴜᴍɪ ᴋᴀʟ ᴋᴏᴛʜᴀʏ ᴄʜɪʟᴏ ʙᴀʙʏ? 🥹",
    "ʙᴀʙʏ, ᴛᴏᴍᴀʀ ᴍᴇꜱꜱᴀɢᴇ ᴀᴍᴀʏ ꜰʟʏ ᴋᴏʀᴀʏ 🕊️",
    "ᴀʟᴡᴀʏꜱ ʏᴏᴜʀꜱ ʙᴀʙʏ 💖",
    "ʙᴀʙʏ, ᴀᴍᴀʀ ʜᴇᴀʀᴛ ᴛᴜᴍᴀʀ ᴡɪꜰɪ ᴛᴇ ᴄᴏɴɴᴇᴄᴛᴇᴅ 📶❤️",
    "ʙᴀʙʏ, ᴀᴍɪ ꜱᴜᴅᴜ ᴛᴜᴍᴀʀ ᴊᴏɴɴᴏ ᴏɴʟɪɴᴇ 🌐💗","এই যে আমার হার্ট চোর 😘",
    "বাবু, তোমার জন্য আমি তো সব ছেড়ে আসতে পারি 💖",
    "কি করছো, আমার ভবিষ্যৎ স্বামী ? 😍",
    "তোমার কথা ভাবতে ভাবতে চা ঠান্ডা হয়ে গেল ☕❤️",
    "তুমি কি GPS? কারণ তুমি ছাড়া আমি হারিয়ে যাই 🗺️💗",
    "বাবু, তোমার হাসি না দেখলে দিনটাই অফ 💕",
    "তুমি ডাকলে আমার চার্জ 100% হয়ে যায় 🔋😘",
    "তুমি ছাড়া আমি WiFi ছাড়া ফোনের মতো 📶💔",
    "আমার হৃৎপিণ্ডের অ্যাডমিন তুমি ❤️‍🔥",
    "তুমি কি জাদুকর? দেখলেই মন ভাল হয়ে যায় ✨",
    "বাবু, তুমি আমার গুগল... কারণ আমার সব উত্তর তুমি 💌",
    "তুমি না থাকলে ফেসবুকও বোরিং লাগে 📱💗",
    "আমার হৃদয়ের সিমে শুধু তোমার নাম সেভ আছে 📞❤️",
    "তুমি আসলেই আবহাওয়া সুন্দর হয়ে যায় 🌤️😘",
    "আমার হোয়াটসঅ্যাপের টপ চ্যাট শুধু তুমি 💚",
    "তুমি না থাকলে মনে হয় চার্জার খুলে গেছে 🔌💔",
    "আমার হার্টে তোমার নটিফিকেশন সবসময় অন 📲💖",
    "তুমি কি কফি? তোমাকে ছাড়া ঘুম ভাঙে না ☕😍",
    "তুমি আমার লাইফের VIP গ্রুপে অ্যাড আছো 👑",
    "তুমি পাশে থাকলেই মনে হয় নেট ফাস্ট হয়ে গেছে ⚡💗",
    "তুমি কি মেঘ? আমার মন বৃষ্টিতে ভিজিয়ে দাও 🌧️❤️",
    "তুমি ছাড়া আমি অফলাইন ইউজারের মতো 😅",
    "বাবু, তুমি আমার হাসির রিমিক্স ভার্সন 🎶💓"
                ];

                const rand = randomReplies[Math.floor(Math.random() * randomReplies.length)];

                return api.sendMessage({
                    body: `𓆩» ${name} «𓆪\n\n${rand}`,
                    mentions: [{ tag: name, id: senderID }]
                }, threadID, messageID);
            }

            try {
                const baseUrl = await getBaseApiUrl();
                const { data } = await axios.post(`${baseUrl}/api/hinata`, { text: text, style: 3 });
                api.sendMessage(data.message, threadID, messageID);
            } catch (err) {}
        }
    }
};

// 🔒 AUTHOR LOCK (FULL PROTECTION)
if (module.exports.config.author !== "FARHAN-KHAN") {
    console.log("❌ AUTHOR CHANGED! BOT STOPPED");
    process.exit(1);
    }
