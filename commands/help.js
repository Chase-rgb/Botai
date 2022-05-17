const { SlashCommandBuilder } = require('@discordjs/builders');

const embed = {
    "title": `Help Commands`,
    "description": "",
    "color": 0xff009d,
    "fields": [
      {
        "name": `/subscribe`,
        "value": `Get pinged if someone post some sauce with a tag you enjoy`
      },
      {
        "name": `/unsubcribe`,
        "value": `Removes tag from subscribe list`
      },
      {
        "name": `/blacklist`,
        "value": `No longer get pinged when someone posts sauce with given tag`
      },
      {
        "name": `/unblacklist`,
        "value": `Removes tag from blacklist`
      },
      {
        "name": `/my-tags`,
        "value": `List your subscribed tags`
      },
      {
        "name": `/clear-subscriptions`,
        "value": `Removes all your subscriptions`
      }
    ],
    "thumbnail": {
      "url": `https://i.imgur.com/uLAimaY.png`,
      "height": 0,
      "width": 0
    }
  };


module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Returns all possible commands'),
	async execute(interaction) {
		await interaction.reply({ embeds: [embed] });
	},
};
