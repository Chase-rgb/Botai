const { Client, Intents } = require("discord.js")
const nhentai = require('nhentai-js')
require('dotenv').config();

const client = new Client({
    intents:[
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})

client.on('ready', () => {
    console.log(`The bot is ready. \nLogged in as ${client.user.tag}`)
})

const sixNumsRegex = /\b\d{6}\b/g;
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    let digits = message.content.match(sixNumsRegex)
    if (digits) {
        console.log(`Digits: ${digits}`);
        console.log(digits);
        console.log(typeof digits);
        for (const sauce in digits) {
            try {
                console.log(`Sauce: ${digits[sauce]}`);
                let nhentaiResponse = await getDojinInfo(digits[sauce]);
                console.log(nhentaiResponse);
                console.log(`Title: ${nhentaiResponse.title}`);
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