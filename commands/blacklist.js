const { SlashCommandBuilder } = require('@discordjs/builders');
const mongoose = require('./../database/mongoose');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription("Don't get pinged when sauce has these tags")
        .addStringOption(option => 
            option.setName('tags')
                .setDescription("Tag being blacklisted. If blacklisting multiple tags, separate with commas")
                .setRequired(true)),
	async execute(interaction) {
        const tags = interaction.options.getString('tags').split(/, |,/).map(x => x.toLowerCase());
        const response = await mongoose.addBlacklistToUser(interaction.user.id, tags);
        console.log (response);
		await interaction.reply(`Tags blacklisted: ${tags}`);
	},
};