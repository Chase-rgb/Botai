const { SlashCommandBuilder } = require('@discordjs/builders');
const mongoose = require('./../database/mongoose');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('unblacklist')
        .setDescription('Removes tag from blacklists')
        .addStringOption(option => 
            option.setName('tags')
                .setDescription("Tags being unblacklisted from. If unblacklisting with multiple tags, separate with commas")
                .setRequired(true)),
	async execute(interaction) {
		const tags = interaction.options.getString('tags').split(/, |,/).map(x => x.toLowerCase());
        const response = await mongoose.removeBlacklistFromUser(interaction.user.id, tags);
        console.log (response);
		await interaction.reply(`Tags removed: ${tags}`);
	},
};