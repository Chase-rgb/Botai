const { SlashCommandBuilder } = require('@discordjs/builders');
const mongoose = require('./../database/mongoose');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('unsubscribe')
        .setDescription('Unsubscribe from a tag')
        .addStringOption(option => 
            option.setName('tags')
                .setDescription("Tags being unsubscribed from")
                .setRequired(true)),
	async execute(interaction) {
		const tags = interaction.options.getString('tags').split(/, |,/).map(x => x.toLowerCase());
        const response = await mongoose.removeTagFromUser(interaction.user.id, tags);
        console.log (response);
		await interaction.reply(`Tags removed: ${tags}`);
	},
};