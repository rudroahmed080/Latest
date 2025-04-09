const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "2.0",
    author: "Modified by Rana",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Display command list or info for a specific command"
    },
    longDescription: {
      en: "View full list of available commands or detailed information about a specific command."
    },
    category: "info",
    guide: {
      en: "{pn} [command name]"
    }
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      for (const [name, value] of commands) {
        if (value.config.role > role) continue;
        const category = value.config.category || "Uncategorized";
        if (!categories[category]) categories[category] = [];
        categories[category].push(name);
      }

      let msg = "╭━〔 RU BOT HELP PANEL 〕━╮\n";
      for (const [cat, cmds] of Object.entries(categories)) {
        msg += `\n╰─【 ${cat.toUpperCase()} 】─╮\n`;
        cmds.sort().forEach(cmd => {
          msg += `│ ∘ ${cmd}\n`;
        });
        msg += "╰───────────────╯\n";
      }

      msg += `\nTotal Commands: ${commands.size}\nPrefix for this group: ${prefix}\nUse '${prefix}help [command]' for details.\n\nBot Admin: Rana Babu`;

      await message.reply(msg);
    } else {
      const cmdName = args[0].toLowerCase();
      const command = commands.get(cmdName) || commands.get(aliases.get(cmdName));

      if (!command)
        return message.reply(`⚠️ | Command '${cmdName}' not found.`);

      const conf = command.config;
      const roleStr = ["All Users", "Group Admins", "Bot Admin"][conf.role] || "Unknown";

      const info = `
╭━〔 COMMAND INFO 〕━╮
│ Name: ${conf.name}
│ Description: ${conf.longDescription?.en || "No description"}
│ Aliases: ${conf.aliases?.join(", ") || "None"}
│ Version: ${conf.version || "1.0"}
│ Author: ${conf.author || "Unknown"}
│ Required Role: ${roleStr}
│ Cooldown: ${conf.countDown || 0}s
│ Usage: ${conf.guide?.en?.replace(/{p}/g, prefix).replace(/{n}/g, conf.name) || "No usage guide"}
╰━━━━━━━━━━━━━━━━━╯
      `;

      await message.reply(info);
    }
  }
};
