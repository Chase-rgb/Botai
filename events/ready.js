const mongoose = require('./../database/mongoose');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`The bot is ready. \nLogged in as ${client.user.tag}`)
        await mongoose.init();
    }
}