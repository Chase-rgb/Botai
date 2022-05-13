const { SlashCommandBuilder } = require('@discordjs/builders');
const mongoose = require('../database/mongoose');

const embed = {
    "title": `Help Commands`,
    "description": "",
    "color": 0xff009d,
    "fields": [],
    // "fields": [
    //   {
    //     "name": `/subscribe`,
    //     "value": `Get pinged if someone post some sauce with a tag you enjoy`
    //   },
    //   {
    //     "name": `/unsubcribe`,
    //     "value": `No longer get pinged when someone posts sauce with given tag`
    //   },
    //   {
    //     "name": `/myTags`,
    //     "value": `List your subscribed tags`
    //   }
    // ],
    "thumbnail": {
      "url": `https://i.imgur.com/uLAimaY.png`,
      "height": 0,
      "width": 0
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