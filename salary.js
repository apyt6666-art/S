const { SlashCommandBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");

const db = new QuickDB();

module.exports = {
  name: "راتب",

  data: new SlashCommandBuilder()
    .setName("راتب")
    .setDescription("استلام الراتب اليومي"),

  async execute(message, args, client, interaction) {
    const user = interaction?.user || message.author;

    const salaryKey = `salary_${user.id}`;
    const lastSalary = await db.get(salaryKey);

    const cooldown = 24 * 60 * 60 * 1000;

    if (
      lastSalary &&
      Date.now() - lastSalary < cooldown
    ) {
      const timeLeft =
        cooldown - (Date.now() - lastSalary);

      const hours = Math.floor(
        timeLeft / (1000 * 60 * 60)
      );

      const text =
        `⏳ أخذت راتبك اليوم\nباقي ${hours} ساعة`;

      if (interaction)
        return interaction.reply({
          content: text,
          ephemeral: true
        });

      return message.reply(text);
    }

    const amount =
      Math.floor(Math.random() * 261) + 240;

    const currentCoins =
      (await db.get(`coins_${user.id}`)) || 0;

    await db.set(
      `coins_${user.id}`,
      currentCoins + amount
    );

    await db.set(
      salaryKey,
      Date.now()
    );

    const text =
      ` 🤩 استلمت راتبك: **${amount}** كوين`;

    if (interaction)
      return interaction.reply(text);

    return message.reply(text);
  }
};
