const { SlashCommandBuilder } = require('@discordjs/builders');
const mongoose = require('./../database/mongoose');
const messageFunctions = require('./../events/messageCreate');
const { API } = require('nhentai-api');
const messageCreate = require('./../events/messageCreate');
const api = new API();


async function randWithUserTags(userId) {
    var queryList = []
    const response = (await mongoose.getTags(userId))[0];
    // console.log(`Mongoose response: ${response}`);
    const tags = response.tags;
    const blacklists = response.blacklist
    if (tags && tags.length != 0) {
        queryList.push('"' + tags[Math.floor(Math.random() * tags.length)] + '"');
    }
    // console.log(`Blacklist: ${blacklists}`)
    if (blacklists && blacklists.length != 0) {
        blacklists.forEach(tag => queryList.push('-"' + tag.replace(" ", '+') + '"'))
    }
    // console.log(`Finished query list ${queryList}`)
    return await randWithNewTags(queryList)
}

async function randWithNewTags(tags) {
    // console.log(tags);
    var sauce = ""
    const queryString = tags.join('+');
    await api.search(queryString).then(async result => {
        console.log(queryString);
        randomPage = Math.floor(Math.random() * result.pages);

        result = (await api.search(queryString, randomPage + 1))
        // console.log(result)

        randomBook = Math.floor(Math.random() * result.perPage);

        console.log(`Page: ${randomPage}. Book: ${randomBook}`);
        sauce = result.books[randomBook]?.id
    }).catch(err => {
        console.log(`Error while using NhentaiAPI: ${err}`)
    })
    return sauce;
}

async function completelyRandom() {
    return await (await api.getRandomBook()).id;
}

function parseTags(tagsArray) {
    const queryList = []
    tagsArray.forEach(tag => queryList.push('"' + tag.replace(" ", '+') + '"'))
    return queryList;
} 


module.exports = {
	data: new SlashCommandBuilder()
        .setName('random')
        .setDescription('Get random doujin')
        // .addStringOption(option => 
        //     option.setName('tags')
        //         .setDescription("Tags you want the random doujin to have. If subcribing with multiple tags, separate with commas")
        //         .setRequired(true))
        .addSubcommand(subcommand => subcommand
            .setName('no-tags')
            .setDescription(`Randomly chooses doujin`))
        .addSubcommand(subcommand => subcommand
            .setName('my-tags')
            .setDescription(`Searches for a random doujin with one of your subscribed tags`))
        .addSubcommand(subcommand => subcommand
            .setName('input-tags')
            .setDescription(`Searches for a random doujin with input tags`)
            .addStringOption(option => 
                option.setName('tags')
                    .setDescription("Tags you want the random doujin to have. If using multiple tags, separate with commas")
                    .setRequired(true))),
	async execute(interaction) {
        var sauce;
        if (interaction.options.getSubcommand() === 'my-tags') {
            sauce = await randWithUserTags(interaction.user.id);
        } else if (interaction.options.getSubcommand() === 'input-tags') {
            tags = interaction.options.getString('tags').split(/, |,/).map(x => x.toLowerCase());
            sauce = await randWithNewTags(parseTags(tags))
        } else if (interaction.options.getSubcommand() === 'no-tags') {
            sauce = await completelyRandom();
        }
        // console.log(`sauce: ${sauce}`)
        // const response = await mongoose.addTagToUser(interaction.user.id, tags);
        // console.log (response);
        if (!sauce) {
            await interaction.reply(`Error occured. No response found`);
        } else {
		    await messageCreate.cloudflareDownInteraction(interaction, sauce);
        }
	},
};