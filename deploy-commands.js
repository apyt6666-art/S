const { REST, Routes } = require('discord.js');
const config = require('./config.json');

const commands = [
  require('./commands/setrole'),
  require('./commands/setchannel'),
  require('./commands/setimage'),
  require('./commands/setcolor'),
  require('./commands/setdone'),
  require('./commands/setnotdone'),
  require('./commands/countdown'),
  require('./commands/sendembed')
].map(c => c.data.toJSON());

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
  for (const guildId of config.guilds) {
    await rest.put(
      Routes.applicationGuildCommands(config.clientId, guildId),
      { body: commands }
    );
    console.log(`Deployed to ${guildId}`);
  }
})();
