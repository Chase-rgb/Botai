const mongoose = require('mongoose');
const path = require('path');
const User = require(path.resolve(__dirname, "./userSchema.js"))
// const Tag = require(path.resolve(__dirname, "./tags.js"))
require('dotenv').config();

const init = async () => {
    const dbOptions = {
        connectTimeoutMS: 10000
    };

    mongoose.connect(process.env.MONGODB_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
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
};

const createUser = (user) => {
    return User.create(user).then(message => {
        console.log("\n>>User Created: ", message)
        return message;
    })
};


const addTagToUser = (userId, tag) => {
    console.log(`Adding tags: ${tag} to userID ${userId}`);
    return User.findByIdAndUpdate(
        userId,
        { $addToSet: { tags: tag }},
        { new: true}
    );
};

const getTags = async (userId) => {
    const response = await User.find({ _id : userId });
    return response[0].tags.sort();
}

const removeTagFromUser = (userId, tag) => {
    console.log(`Removing tags: ${tag} from userID: ${userId}`);
    return User.findByIdAndUpdate(
        userId,
        { $pull: {tags: {$in: tag}}},
        { new: true }
    )
}

module.exports = {
    init,
    createUser,
    addTagToUser,
    removeTagFromUser,
    getTags
};