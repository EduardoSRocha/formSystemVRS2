const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

//SCHEMA FOR SETUP USER 
let UserSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    email: String,
    password: String,
    gender: String,
    AnswerPoints: {type: Number, default: 0}, 
    AskPoints: {type: Number, default: 0},
    bday: {type: Date},
    association: { type: Date, default: Date.now },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Users", UserSchema);