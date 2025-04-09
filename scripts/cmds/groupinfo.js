  module.exports = {
  config: {
    name: "groupallinfo",
    aliases: ['ginfo', 'groupdetails'],
    version: "1.0",
    author: "YourName",
    countDown: 0,
    role: 0,
    shortDescription: "Shows all group info in a minimalist style (text only)",
    longDescription: "Displays complete information about a group in a beautifully minimalist styled text message.",
    category: "box chat",
    guide: {
      en: "{p}groupallinfo"
    }
  },

  onStart: async function({ api, event, args }) {
    // Group er shob info collect kora hocche
    let threadInfo = await api.getThreadInfo(event.threadID);
    let {
      threadName,
      threadID,
      participantIDs,
      adminIDs,
      messageCount,
      emoji,
      approvalMode,
      userInfo
    } = threadInfo;

    // Emoji jodi na thake tahole default value
    emoji = emoji || "N/A";
    let totalMembers = participantIDs.length;
    
    // Gender count calculate kora
    let maleCount = 0;
    let femaleCount = 0;
    let unknownGender = 0;
    for (let id in userInfo) {
      if (userInfo[id].gender === "MALE") maleCount++;
      else if (userInfo[id].gender === "FEMALE") femaleCount++;
      else unknownGender++;
    }
    
    // Admin der naam collect kora
    let adminList = "";
    for (let i = 0; i < adminIDs.length; i++) {
      let adminId = adminIDs[i];
      if (typeof adminId === "object" && adminId.id) adminId = adminId.id;
      let adminData = await api.getUserInfo(adminId);
      let adminName = adminData[adminId] ? adminData[adminId].name : adminId;
      adminList += `• ${adminName}\n`;
    }
    
    let approvalStatus = approvalMode ? "Turned on" : "Turned off";

    // Minimalist frame design without asterisks, final line with bold font using Unicode
    let styledContent =
`┌─ Group Info 
│ Name: ${threadName}
│ Grp ID: ${threadID}
│ Total Members: ${totalMembers}
├─ Members Breakdown 
│🧑‍🦰 Males: ${maleCount}
│👩‍🦰 Females: ${femaleCount}
│👨‍🍼 Unknown: ${unknownGender}
├──────────────────
│ Approval Mode: ${approvalStatus}
│ Emoji: ${emoji}
│ Total Messages: ${messageCount}
├─ Administrators
${adminList.trim() ? adminList : "│ None"}
└──────────────────
💠𝐁𝐨𝐭 𝐀𝐝𝐦𝐢𝐧: 𝐑𝐚𝐧𝐚 𝐁𝐚𝐛𝐮`;

    return api.sendMessage(styledContent, event.threadID, event.messageID);
  }
};
