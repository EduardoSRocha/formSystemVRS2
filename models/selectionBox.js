const mongoose = require('mongoose');

//SCHEMA FOR SETUP SELECTIONBOX QUESTIONS 
let selectionBox = new mongoose.Schema({
    creationDate: { type: Date, default: Date.now },
    expirationDate: Date,
    title: String,
    description: String,
    options: [
        {
            option: {
                _id: mongoose.Schema.Types.ObjectId,
                type: String
            }
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

module.exports = mongoose.model("selectionBox", selectionBox);