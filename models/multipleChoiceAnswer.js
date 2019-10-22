const mongoose = require('mongoose');

//SCHEMA FOR SETUP ANSWER OF MULTIPLES CHOICES QUESTIONS 
let multipleChoiceAnswer = new mongoose.Schema({
    answerDate: { type: Date, default: Date.now },
    question:{
        id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "MultipleChoice"
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

module.exports = mongoose.model("multipleChoiceAnswer", multipleChoiceAnswer);