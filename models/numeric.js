const mongoose = require('mongoose');

//SCHEMA FOR SETUP Numeric QUESTIONS 
let numeric = new mongoose.Schema({
    creationDate: { type: Date, default: Date.now },
    expirationDate: Date,
    title: String,
    description: String,
    options: [
        {
            option: {
                type: Number
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

module.exports = mongoose.model("numeric", numeric);