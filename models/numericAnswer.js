const mongoose = require('mongoose');

//SCHEMA FOR SETUP ANSWER OF Numeric QUESTIONS 
let numericAnswer = new mongoose.Schema({
    answerDate: { type: Date, default: Date.now },
    question:{
        id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Numeric"
        }
     },
     answer: Number,
     whoAnswered: {
        id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
        },
        username: String
     }
});

module.exports = mongoose.model("numericAnswer", numericAnswer);