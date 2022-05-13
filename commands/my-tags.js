const { SlashCommandBuilder } = require('@discordjs/builders');
const mongoose = require('../database/mongoose');

const embed = {
    "title": `Subscribed Tags`,
    "description": "",
    "color": 0xff009d,
    "thumbnail": {
      "url": `https://i.imgur.com/uLAimaY.png`,
    }
  };

module.exports = {
	data: new SlashCommandBuilder()
		.setName('my-tags')
		.setDescription('Shows currently subscribed tags'),
	async execute(interaction) {
		const tags = await mongoose.getTags(interaction.user.id);
    // console.log (tags);
		tags.forEach(tag => embed.description = embed.description + tag + "\n");
    // console.log(embed);
		await interaction.reply({ embeds: [embed] });
	},
};