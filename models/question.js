const mongoose = require('mongoose');

//SCHEMA FOR SETUP LONGTEXT QUESTIONS 
let Question = new mongoose.Schema({
    creationDate: { type: Date, default: Date.now },
    expirationDate: Date,
    title: String,
    type: {type: String, lowercase: true, trim: true},
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    optionsText: [
        {
            type: String
        }
    ],
    optionsNumber: [
        {
            type: Number
        }
    ],
    whoAnswered:[ String ]
});

module.exports = mongoose.model("question", Question);