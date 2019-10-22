const mongoose = require('mongoose');

//SCHEMA FOR SETUP ANSWER OF shortText QUESTIONS 
let shortTextAnswer = new mongoose.Schema({
    answerDate: { type: Date, default: Date.now },
    question:{
        id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "ShortText"
        }
     },
     answer: String,
     whoAnswered: {
        id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
        },
        username: String
     }
});

module.exports = mongoose.model("shortTextAnswer", shortTextAnswer);