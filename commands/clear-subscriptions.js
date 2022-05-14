const { SlashCommandBuilder } = require('@discordjs/builders');
const mongoose = require('./../database/mongoose');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('clear-subscriptions')
        .setDescription('Remove all your subscriptions'),
	async execute(interaction) {
        const response = await mongoose.clearTags(interaction.user.id);
        console.log (response);
		await interaction.reply( {content: `All subscriptions removed`});
	},
};