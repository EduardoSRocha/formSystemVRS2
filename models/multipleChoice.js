const mongoose = require('mongoose');

//SCHEMA FOR SETUP MULTIPLECHOICES QUESTIONS 
let multipleChoice = new mongoose.Schema({
    creationDate: { type: Date, default: Date.now },
    expirationDate: Date,
    title: String,
    description: String,
    options: [
        {
            type: String
        }
    ],
    author: {
        id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
        },
        username: String
     }
});

module.exports = mongoose.model("multipleChoice", multipleChoice);