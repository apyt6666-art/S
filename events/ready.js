const { ActivityType } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,

  async execute(client) {
    console.log(`✅ ${client.user.tag} is online`);

    client.user.setPresence({
      activities: [
        {
          name: "نظام الزواج 💍",
          type: ActivityType.Watching
        }
      ],
      status: "online"
    });
  }
};
