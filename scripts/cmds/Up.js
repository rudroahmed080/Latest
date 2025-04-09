const moment = require('moment-timezone');
module.exports = {
  config: {
    name: "uptime",
    version: "1.0",
    aliases: ["upt", "up"],
    author: "Rana with gpt",
    role: 0,
    cooldown: 5,
    shortDescription: {
      vi: "",
      en: "Sends information about the bot and admin."
    },
    longDescription: {
      vi: "",
      en: "Sends information about the bot and admin."
    },
    category: "system",
    guide: {
      en: ""
    },
    envConfig: {}
  },

  onStart: async function ({ message, usersData, threadsData }) {
    const now = moment();
    const date = now.format('DD/MM/YYYY');

    const uptime = process.uptime();
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const days = Math.floor(uptime / (60 * 60 * 24));
    const uptimeString = `${days}d ${hours}h ${minutes}m`;

    const allUsers = await usersData.getAll();
    const allThreads = await threadsData.getAll();

    const totalUsers = allUsers.length;
    const totalGroups = allThreads.length;

    const replyMsg = 
`┏━⧫ 𝗕𝗢𝗧 𝗦𝗧𝗔𝗧𝗨𝗦 ⧫━┓
┃📅 Date: ${date}
┃⏱ Uptime: ${uptimeString}
┃👥 Users: ${totalUsers}
┃💬 Groups: ${totalGroups}
┗━⧫ Admin: Rana Babu`;

    message.reply(replyMsg);
  },

  onChat: async function ({ event, message, usersData, threadsData }) {
    if (event.body && event.body.toLowerCase() === "up") {
      this.onStart({ message, usersData, threadsData });
    }
  }
};
