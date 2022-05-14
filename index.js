const { Client, Collection, Intents } = require("discord.js");
const nhentai = require('nhentai-js');
const mongoose = require('./database/mongoose');
const fs = require('node:fs');
require('dotenv').config();

const client = new Client({
    intents:[
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})

client.commands = new Collection();

//Sets up list of command files and sets them on the client
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

//Sets up list of event files and sets them on client
const eventFiles = fs.readdirSync(`./events/`).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}


client.login(process.env.TOKEN);