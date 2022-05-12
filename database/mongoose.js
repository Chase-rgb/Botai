const mongoose = require('mongoose')
require('dotenv').config()

module.exports = {
    init: () => {
        const dbOptions = {
            connectTimeoutMS: 10000
        };

        mongoose.connect(`mongodb+srv://discordBot:${process.env.DBPASS}@botaidb.doyaw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
        mongoose.Promise = global.Promise;

        mongoose.connection.on('connected', () => {
            console.log('The bot has connected to the database.')
        })

        mongoose.connection.on('disconnected', () => {
            console.log('The bot has disconnected to the database.')
        })

        mongoose.connection.on('err', (err) => {
            console.log('Error while connecting to database: ' + err)
        })
    }
}