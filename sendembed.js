const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../models/User');
const Config = require('../models/Config');

const MAX = 500;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sendembed')
    .setDescription('امبيد احترافي'),

  async execute(i) {

    const cfg = await Config.findOne({ guildId: i.guild.id });
    if (!cfg?.roleId) return i.reply('حدد الرتبة');

    const role = i.guild.roles.cache.get(cfg.roleId);

    let desc = '━━━━━━━━━━━━━━\n\n';

    for (const [id] of role.members) {

      const u = await User.findOne({
        userId: id,
        guildId: i.guild.id
      });

      const msg = u?.messages || 0;
      const remain = MAX - msg;

      desc += `👤 **<@${id}>**\n`;

      if (msg >= MAX) {
        desc += `📊 **500 / 500**\n✅ مكتمل\n\n`;
      } else {
        desc += `📊 **${msg} / 500**\n⏳ باقي: **${remain}**\n\n`;
      }
    }

    desc += '━━━━━━━━━━━━━━';

    const embed = new EmbedBuilder()
      .setTitle('🏆 Weekly Progress')
      .setDescription(desc)
      .setColor(cfg.color || 0x2b2d31)
      .setFooter({ text: 'XP System 🔥' })
      .setTimestamp();

    if (cfg.image) embed.setImage(cfg.image);

    await i.channel.send({
      content: `<@&${cfg.roleId}>`,
      embeds: [embed]
    });

    i.reply({ content: 'تم ✅', ephemeral: true });
  }
};
