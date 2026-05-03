const { SlashCommandBuilder } = require('discord.js');
const Config = require('../models/Config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setchannel')
    .setDescription('تحديد روم')
    .addChannelOption(o => o.setName('channel').setRequired(true)),

  async execute(i) {
    const ch = i.options.getChannel('channel');

    await Config.findOneAndUpdate(
      { guildId: i.guild.id },
      { channelId: ch.id },
      { upsert: true }
    );

    i.reply('تم ✅');
  }
};
