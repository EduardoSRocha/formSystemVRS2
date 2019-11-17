const mongoose = require('mongoose');

//SCHEMA FOR SETUP ANSWER OF longText QUESTIONS 
let Answer = new mongoose.Schema({
    denounce: String,
    category: String, 
    question:{
        id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "question"
        }
     },
    whoDenounced: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    Resolved: Boolean
})

module.exports = mongoose.model("answer", Answer);