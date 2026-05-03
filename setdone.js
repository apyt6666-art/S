const { SlashCommandBuilder } = require('discord.js');
const Config = require('../models/Config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setdone')
    .setDescription('رسالة الانجاز')
    .addStringOption(o => o.setName('msg').setRequired(true)),

  async execute(i) {
    const msg = i.options.getString('msg');

    await Config.findOneAndUpdate(
      { guildId: i.guild.id },
      { doneMsg: msg },
      { upsert: true }
    );

    i.reply('تم ✅');
  }
};
