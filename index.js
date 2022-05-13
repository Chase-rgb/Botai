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

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

client.on('ready', async () => {
    console.log(`The bot is ready. \nLogged in as ${client.user.tag}`)
    await mongoose.init();
    // var testUser = await mongoose.createUser({
    //     username: "Test",
    //     discordId: "1234567890"
    // })
    // await mongoose.addTagToUser(280538761710796800, "Sci-Fi");
})

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});


const sixNumsRegex = /\b\d{6}\b/g;
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    let digits = message.content.match(sixNumsRegex)
    if (digits) {
        // console.log(`Digits: ${digits}`);
        // console.log(digits);
        // console.log(typeof digits);
        for (const sauce in digits) {
            try {
                // console.log(`Sauce: ${digits[sauce]}`);
                let nhentaiResponse = await getDojinInfo(digits[sauce]);
                // console.log(nhentaiResponse);
                // console.log(`Title: ${nhentaiResponse.title}`);
                message.reply({
                    content: formResponse(nhentaiResponse)
                })
            } catch (e) {
                console.log(e)
            }
        }
    }
})


async function getDojinInfo(sauce) {
    // console.log(sauce)
    if(nhentai.exists(sauce)) { // checks if doujin exists
        const dojin = await nhentai.getDoujin(sauce)
        // console.log(dojin);
        return dojin;
    }
}

function formResponse(dojin) {
    let response = ""
    response += dojin.link + '\n';
    response += dojin.title + '\n';
    return response;
}

client.login(process.env.TOKEN);