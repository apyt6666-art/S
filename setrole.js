const { SlashCommandBuilder } = require('discord.js');
const Config = require('../models/Config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setrole')
    .setDescription('تحديد الرتبة')
    .addRoleOption(o => o.setName('role').setRequired(true)),

  async execute(i) {
    const role = i.options.getRole('role');

    await Config.findOneAndUpdate(
      { guildId: i.guild.id },
      { roleId: role.id },
      { upsert: true }
    );

    i.reply('تم ✅');
  }
};
