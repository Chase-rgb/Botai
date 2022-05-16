const { SlashCommandBuilder } = require('@discordjs/builders');
const mongoose = require('../database/mongoose');


  
module.exports = {
	data: new SlashCommandBuilder()
		.setName('my-tags')
		.setDescription('Shows currently subscribed tags'),
	async execute(interaction) {
    const embed = {
      "color": 0xff009d,
      "fields": [],
      "thumbnail": {
        "url": `https://i.imgur.com/uLAimaY.png`,
      }
    };

		const response = (await mongoose.getTags(interaction.user.id))[0];
    // console.log(response);
    if (response) {
        if (response.tags.length != 0) {
          var tagList = ""
          const tags = response.tags?.sort();
          tags.forEach(tag => tagList += tag + "\n");
          embed.fields.push ({ "name": "Subscribed tags", "value": tagList})
        }
        if (response.blacklist.length != 0) {
          var list = ""
          const blacklist = response.blacklist.sort();
          blacklist.forEach(tag => list += tag + '\n');
          embed.fields.push({ "name": "Blacklisted tags", "value": list });
        }
        if (embed.fields.length == 0) {
          embed.title = "No tags associated with User"
        }

        // var blackList = "Test"
        // const blacklist = response.blacklist?.sort()
        // blacklist?.forEach(tag => blackList += tag + "\n");
        // embed.fields[1].value = blackList;
        // console.log(embed);
    } else {
      embed.title = "No tags associated with User"
    }
    // console.log(embed);
		await interaction.reply({ embeds: [embed] });
	},
};