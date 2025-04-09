module.exports = {
  config: {
    name: "remove",
    aliases: ["rmv", "dlt"],
    author: "Rana with gpt",
    version: "2.6",
    cooldowns: 5,
    role: 0,
    longDescription: {
      en: "Unsend the last specified number of messages sent by the bot in the current group."
    },
    category: "owner",
    guide: {
      en: "{p}{n} [number_of_messages]"
    }
  },
  onStart: async function ({ api, event, args }) {
    const targetCount = parseInt(args[0]);
    if (isNaN(targetCount) || targetCount <= 0) {
      return api.sendMessage("Please provide a valid number.", event.threadID);
    }

    const botID = api.getCurrentUserID();
    const fetchLimit = targetCount * 5;

    try {
      const messages = await api.getThreadHistory(event.threadID, fetchLimit);
      const botMessages = messages.filter(msg => msg.senderID === botID);

      if (botMessages.length === 0) return;

      botMessages.sort((a, b) => a.timestamp - b.timestamp);
      const messagesToDelete = botMessages.slice(-targetCount);

      for (const msg of messagesToDelete) {
        await api.unsendMessage(msg.messageID);
      }

      // React to the user's command message
      await api.setMessageReaction("🆗", event.messageID, () => {}, true);

      // Delete the user's command message
      await api.unsendMessage(event.messageID);

    } catch (err) {
      console.error("Failed to unsend messages:", err);
      return api.sendMessage("An error occurred while removing messages.", event.threadID);
    }
  }
};
