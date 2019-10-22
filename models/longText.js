const mongoose = require('mongoose');

//SCHEMA FOR SETUP LONGTEXT QUESTIONS 
let longText = new mongoose.Schema({
    creationDate: { type: Date, default: Date.now },
    expirationDate: Date,
    title: String,
    description: String,
    author: {
        id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
        },
        username: String
     }
});

module.exports = mongoose.model("longText", longText);