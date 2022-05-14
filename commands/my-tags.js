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
		const response = (await mongoose.getTags(interaction.user.id))[0];
    console.log(response);
    if (response) {
        var tagList = ""
        response.tags.forEach(tag => tagList += tag + "\n");
        embed.description = tagList;
        // console.log(embed);
    }
		await interaction.reply({ embeds: [embed] });
	},
};