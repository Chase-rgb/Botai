const { SlashCommandBuilder } = require('@discordjs/builders');
const mongoose = require('./../database/mongoose');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('subscribe')
        .setDescription('Get pinged when someone posts a doujin with this tag')
        .addStringOption(option => 
            option.setName('tags')
                .setDescription("Tag being subscribed to. If subcribing with multiple tags, separate with commas")
                .setRequired(true)),
	async execute(interaction) {
        const tags = interaction.options.getString('tags').split(/, |,/).map(x => x.toLowerCase());
        const response = await mongoose.addTagToUser(interaction.user.id, tags);
        console.log (response);
		await interaction.reply(`Tags added: ${tags}`);
	},
};