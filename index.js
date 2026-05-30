const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
require("dotenv").config();

const { QuickDB } = require("quick.db");
const db = new QuickDB();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

const prefix = "-";

/* ================= ECONOMY ================= */

async function getCoins(id) {
  return await db.get(`coins_${id}`) || 0;
}

async function addCoins(id, amount) {
  const c = await getCoins(id);
  await db.set(`coins_${id}`, c + amount);
}

async function removeCoins(id, amount) {
  const c = await getCoins(id);
  await db.set(`coins_${id}`, Math.max(0, c - amount));
}

/* ================= TASKS ================= */

const tasks = [
  "منشن شخصين",
  "ارسل مقطع",
  "اكتب 10 رسائل",
  "ادخل روم صوتي",
  "اكتب 30 رسالة",
  "رد على 3 اشخاص"
];

/* ================= READY ================= */

client.on("ready", () => {
  console.log(`${client.user.tag} is ready`);
});

/* ================= MESSAGE HANDLER ================= */

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(1).split(" ");
  const cmd = args[0];

  const user = message.author;

/* ================= راتب ================= */

if (cmd === "راتب") {
  const last = await db.get(`salary_${user.id}`);

  if (last && Date.now() - last < 86400000)
    return message.reply("⏳ أخذت راتبك اليوم");

  const amount = Math.floor(Math.random() * 261) + 240;

  await addCoins(user.id, amount);
  await db.set(`salary_${user.id}`, Date.now());

  return message.reply(`💰 استلمت ${amount}`);
}

/* ================= فلوسي ================= */

if (cmd === "فلوسي") {
  const target = message.mentions.users.first() || user;
  const coins = await getCoins(target.id);

  return message.reply(`💰 ${target.username}: ${coins}`);
}

/* ================= تحويل ================= */

if (cmd === "تحويل") {
  const target = message.mentions.users.first();
  const amount = parseInt(args[2]);

  if (!target || !amount)
    return message.reply("-تحويل @شخص مبلغ");

  const tax = Math.floor(amount * 0.4);
  const final = amount - tax;

  const bal = await getCoins(user.id);

  if (bal < amount)
    return message.reply("ما عندك فلوس");

  await removeCoins(user.id, amount);
  await addCoins(target.id, final);

  return message.reply(`✔ تم التحويل (ضريبة ${tax})`);
}

/* ================= توب ================= */

if (cmd === "توب") {
  const all = await db.all();

  const top = all
    .filter(x => x.id.startsWith("coins_"))
    .sort((a,b) => b.value - a.value)
    .slice(0, 10);

  let desc = "";

  top.forEach((u, i) => {
    const id = u.id.split("_")[1];
    desc += `**${i+1}.** <@${id}> — ${u.value}\n`;
  });

  return message.reply({
    embeds: [
      new EmbedBuilder()
        .setTitle("🏆 Top 10")
        .setDescription(desc)
        .setColor("White")
    ]
  });
}

/* ================= إنجاز ================= */

if (cmd === "انجاز") {
  const count = await db.get(`task_${user.id}`) || 0;

  if (count >= 2)
    return message.reply("خلصت إنجازاتك اليوم");

  const task = tasks[Math.floor(Math.random() * tasks.length)];
  const reward = Math.floor(Math.random() * 101) + 200;

  await addCoins(user.id, reward);
  await db.add(`task_${user.id}`, 1);

  return message.reply(`🎯 ${task}\n💰 ${reward}`);
}

/* ================= زواج ================= */

if (cmd === "زواج") {
  const target = message.mentions.users.first();
  if (!target) return message.reply("منشن الشخص");

  if (await db.get(`married_${user.id}`))
    return message.reply("انت متزوج");

  if (await db.get(`married_${target.id}`))
    return message.reply("الشخص متزوج");

  const emojis = ["💐","💍","💞","❤️"];
  const emoji = emojis[Math.floor(Math.random()*emojis.length)];

  const embed = new EmbedBuilder()
    .setTitle("💍 طلب زواج")
    .setDescription(`<@${user.id}> يريد الزواج من <@${target.id}> ${emoji}`)
    .setColor("Pink");

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("accept")
      .setLabel("موافقة")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId("reject")
      .setLabel("رفض")
      .setStyle(ButtonStyle.Danger)
  );

  const msg = await message.channel.send({ embeds: [embed], components: [row] });

  const collector = msg.createMessageComponentCollector({ time: 60000 });

  collector.on("collect", async (i) => {
    if (i.user.id !== target.id) return;

    if (i.customId === "reject") {
      return i.update({ content: "💔 تم الرفض", components: [] });
    }

    // قبول الزواج
    await addCoins(user.id, -10000);
    await addCoins(target.id, -10000);

    await db.set(`married_${user.id}`, target.id);
    await db.set(`married_${target.id}`, user.id);

    return i.update({ content: "💍 تم الزواج!", components: [] });
  });
}

/* ================= طلاق ================= */

if (cmd === "طلاق") {
  const target = message.mentions.users.first();

  const partner = await db.get(`married_${user.id}`);

  if (!partner || partner !== target?.id)
    return message.reply("مو متزوجين");

  await db.delete(`married_${user.id}`);
  await db.delete(`married_${target.id}`);

  return message.reply("💔 تم الطلاق");
}

/* ================= خلع ================= */

if (cmd === "خلع") {
  const target = message.mentions.users.first();

  const partner = await db.get(`married_${user.id}`);

  if (!partner || partner !== target?.id)
    return message.reply("مو متزوجين");

  await db.delete(`married_${user.id}`);
  await db.delete(`married_${target.id}`);

  return message.reply("💔 تم الخلع");
}

});

client.login(process.env.TOKEN);
