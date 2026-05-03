const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('countdown')
    .setDescription('كم باقي لنهاية الأسبوع'),

  async execute(i) {

    const now = new Date();
    const saudi = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Riyadh" }));

    const end = new Date(saudi);
    end.setDate(saudi.getDate() + ((4 - saudi.getDay() + 7) % 7));
    end.setHours(23, 59, 0);

    const diff = end - saudi;

    const h = Math.floor(diff / 1000 / 60 / 60);
    const m = Math.floor(diff / 1000 / 60) % 60;

    i.reply(`⏰ باقي: ${h} ساعة و ${m} دقيقة`);
  }
};
