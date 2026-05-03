const { SlashCommandBuilder } = require('discord.js');
const Config = require('../models/Config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setcolor')
    .setDescription('لون الامبيد')
    .addStringOption(o => o.setName('hex').setRequired(true)),

  async execute(i) {
    let c = i.options.getString('hex').replace('#', '');
    const color = parseInt(c, 16);

    await Config.findOneAndUpdate(
      { guildId: i.guild.id },
      { color },
      { upsert: true }
    );

    i.reply('تم 🎨');
  }
};
