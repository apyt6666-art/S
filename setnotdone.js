const { SlashCommandBuilder } = require('discord.js');
const Config = require('../models/Config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setnotdone')
    .setDescription('رسالة اللي ما خلص')
    .addStringOption(o => o.setName('msg').setRequired(true)),

  async execute(i) {
    const msg = i.options.getString('msg');

    await Config.findOneAndUpdate(
      { guildId: i.guild.id },
      { notDoneMsg: msg },
      { upsert: true }
    );

    i.reply('تم ✅');
  }
};
