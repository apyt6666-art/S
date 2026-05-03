const { Client, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
const config = require('./config.json');

const User = require('./models/User');
const Config = require('./models/Config');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

mongoose.connect(config.mongo);

const MAX = 500;

// 📊 XP
client.on('messageCreate', async (msg) => {
  if (msg.author.bot) return;

  let user = await User.findOne({
    userId: msg.author.id,
    guildId: msg.guild.id
  });

  if (!user) {
    user = await User.create({
      userId: msg.author.id,
      guildId: msg.guild.id
    });
  }

  if (user.completed) return;

  user.messages++;

  if (user.messages >= MAX) {
    user.completed = true;

    const cfg = await Config.findOne({ guildId: msg.guild.id });

    if (cfg?.channelId) {
      const ch = msg.guild.channels.cache.get(cfg.channelId);
      ch?.send(`<@${user.userId}> ${cfg.doneMsg || "شطور 🎉"}`);
    }
  }

  await user.save();
});

// ⏰ نظام الأسبوع
setInterval(async () => {
  const now = new Date();
  const saudi = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Riyadh" }));

  // الخميس 11:59
  if (saudi.getDay() === 4 && saudi.getHours() === 23 && saudi.getMinutes() === 59) {
    const users = await User.find();

    for (const u of users) {
      if (!u.completed) {
        const cfg = await Config.findOne({ guildId: u.guildId });
        const guild = client.guilds.cache.get(u.guildId);
        const ch = guild?.channels.cache.get(cfg?.channelId);

        ch?.send(`<@${u.userId}> ${cfg?.notDoneMsg || "زعلان منك 😡"}`);
      }
    }
  }

  // الجمعة 12
  if (saudi.getDay() === 5 && saudi.getHours() === 0 && saudi.getMinutes() === 0) {
    await User.deleteMany({});
    console.log("New Week 🔄");
  }

}, 60000);

// 🎮 سلاش
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const cmd = require(`./commands/${interaction.commandName}.js`);
  cmd.execute(interaction);
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(config.token);
