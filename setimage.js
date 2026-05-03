const { SlashCommandBuilder } = require('discord.js');
const Config = require('../models/Config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setimage')
    .setDescription('صورة الامبيد')
    .addStringOption(o => o.setName('url').setRequired(true)),

  async execute(i) {
    const url = i.options.getString('url');

    await Config.findOneAndUpdate(
      { guildId: i.guild.id },
      { image: url },
      { upsert: true }
    );

    i.reply('تم 🎨');
  }
};
