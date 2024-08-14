const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const user = new Schema({
    email:{
        type: String,
        required: true
    }
});
user.plugin(passportLocalMongoose);

const User = mongoose.model("User", user);

module.exports = User;

