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
		const tags = (await mongoose.getTags(interaction.user.id));
    if (tags) {
        // console.log (tags);
        var tagList = ""
        tags.forEach(tag => tagList += tag + "\n");
        embed.description = tagList;
        // console.log(embed);
    }
		await interaction.reply({ embeds: [embed] });
	},
};