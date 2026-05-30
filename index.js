const {
  Client,
  GatewayIntentBits,
  Collection,
  Partials,
  ActivityType
} = require("discord.js");

require("dotenv").config();
const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Channel]
});

client.commands = new Collection();
client.slashCommands = new Collection();

const prefix = "-";
client.prefix = prefix;

/* ================= COMMAND HANDLER ================= */

const commandsPath = path.join(__dirname, "commands");

if (fs.existsSync(commandsPath)) {
  const folders = fs.readdirSync(commandsPath);

  for (const folder of folders) {
    const folderPath = path.join(commandsPath, folder);

    const files = fs
      .readdirSync(folderPath)
      .filter(file => file.endsWith(".js"));

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const command = require(filePath);

      if (command.name) {
        client.commands.set(command.name, command);
        console.log(`✅ Loaded: ${command.name}`);
      }

      if (command.data) {
        client.slashCommands.set(command.data.name, command);
      }
    }
  }
}

/* ================= EVENTS ================= */

const eventsPath = path.join(__dirname, "events");

if (fs.existsSync(eventsPath)) {
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter(file => file.endsWith(".js"));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if (event.once) {
      client.once(event.name, (...args) =>
        event.execute(...args, client)
      );
    } else {
      client.on(event.name, (...args) =>
        event.execute(...args, client)
      );
    }
  }
}

/* ================= LOGIN ================= */

client.login(process.env.TOKEN);
