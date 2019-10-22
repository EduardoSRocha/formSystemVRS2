const mongoose = require('mongoose');

//SCHEMA FOR SETUP ANSWER OF longText QUESTIONS 
let longTextAnswer = new mongoose.Schema({
    answerDate: { type: Date, default: Date.now },
    question:{
        id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "LongText"
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

module.exports = mongoose.model("longTextAnswer", longTextAnswer);