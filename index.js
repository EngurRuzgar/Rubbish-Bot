const { Client, Collection, Events, GatewayIntentBits, ActivityType, Activity } = require('discord.js');
const { token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
const buttonCommandPath = path.join(__dirname, 'buttonCommands');
const buttonCommands = fs.readdirSync(buttonCommands);
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
const client = new Client({ intents: [GatewayIntentBits.Guilds],  });
const { changeStatus } = require("./util/randomStatus")

setInterval(changeStatus, 300000, client);

// When the client is ready, run this code.
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.on(Events.ClientReady, readyClient => {
	changeStatus(readyClient);
});

// Log in to Discord with your client's token
client.login(token);
client.commands = new Collection();

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		command.name = file.substring(0, command.name.length - 3);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.buttonCommands = new Collection();

for (const buttonCommand of buttonCommands) {
	const filePath = path.join(buttonCommandPath, buttonCommand);
	const command = require(filePath);
	command.name = file.substring(0, command.name.length - 3);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('execute' in command) {
		client.commands.set(command.name, command);
	} else {
		console.log(`[WARNING] The button command at ${filePath} is missing a required "execute" property.`);
	}
}


for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}