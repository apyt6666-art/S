const {
  REST,
  Routes
} = require("discord.js");

require("dotenv").config();

const fs = require("fs");
const path = require("path");

const commands = [];

const commandsPath = path.join(
  __dirname,
  "commands"
);

const folders = fs.readdirSync(
  commandsPath
);

for (const folder of folders) {
  const folderPath = path.join(
    commandsPath,
    folder
  );

  const commandFiles = fs
    .readdirSync(folderPath)
    .filter(file =>
      file.endsWith(".js")
    );

  for (const file of commandFiles) {
    const filePath = path.join(
      folderPath,
      file
    );

    const command =
      require(filePath);

    if (command.data) {
      commands.push(
        command.data.toJSON()
      );
    }
  }
}

const rest = new REST({
  version: "10"
}).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log(
      "⏳ جاري تسجيل أوامر السلاش..."
    );

    await rest.put(
      Routes.applicationCommands(
        process.env.CLIENT_ID
      ),
      { body: commands }
    );

    console.log(
      "✅ تم تسجيل أوامر السلاش"
    );
  } catch (error) {
    console.error(error);
  }
})();
