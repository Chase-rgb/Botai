const mongoose = require("mongoose")

const UserSchema = new mongoose.model(
    "User",
    new mongoose.Schema({
        _id: String,
        tags: [String]
        })
);

module.exports = UserSchema;