module.exports = {
  name: "messageCreate",

  async execute(message, client) {
    if (message.author.bot) return;
    if (!message.guild) return;

    const prefix = client.prefix;

    if (!message.content.startsWith(prefix)) return;

    const args = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/);

    const commandName = args.shift()?.toLowerCase();

    const command =
      client.commands.get(commandName);

    if (!command) return;

    try {
      await command.execute(
        message,
        args,
        client
      );
    } catch (err) {
      console.error(err);

      message.reply(
        "❌ صار خطأ أثناء تنفيذ الأمر"
      );
    }
  }
};
