const express = require('express'),
      router = express.Router(),
      User = require('../.././models/user'),
      Question = require('../.././models/question'),
      Answer = require('../../models/answer'),
      middleware = require("../../middleware");
      var {isLoggedIn, globalenvironment} = middleware; // destructuring assignment


//configure flash
const flash = require('connect-flash');
router.use(flash());

/**Configure global variables */
router.use(globalenvironment);

/** Question question create logic*/
router.post('/longText', (req, res) => {
//lookup question using ID
    User.findById(req.user._id, function(err, user){
    if(err){
        console.log(err);
        res.redirect("/login");
    } else {
        Question.create({ expirationDate: req.body.expirationDate, description: req.body.description, title: req.body.title,  type: "longtext", creationDate: Date.now(), expirationDate: req.body.expirationDate}, function(err, question){
        if(!err){
        //add username and id to question
        question.author.id = user._id;
        question.author.username = user.username;
        question.save();
        res.redirect('/home');
        } else {
        console.log(err);
        res.send(err);
        }
    });
    }
}); 
});

/** change title of question */
router.post("/updateQuestion/changeTitle/:id", function(req, res){
Question.findByIdAndUpdate({_id: req.params.id},{title: req.body.title}, function(err){
    if(err){
        console.log(err);
    } else {
        res.json({ success: true });
    }
    })
})

/** change expirationDate of question */
router.post("/updateQuestion/changeExpirationDate/:id", function(req, res){
    Question.findByIdAndUpdate({_id: req.params.id},{expirationDate: req.body.expirationDate}, function(err){
        if(err){
            console.log(err);
        } else {
            res.json({ success: true });
        }
        })
    })

/** change description of question */
router.post("/updateQuestion/changeDescription/:id", function(req, res){
Question.findByIdAndUpdate({_id: req.params.id},{description: req.body.description}, function(err){
        if(err){
            console.log(err);
        } else {
            res.json({
                success: true
            });
        }
    })
})

/** create answer of multiple questions */
router.post("/longTextAnswer/:id", function(req, res) {
    Answer.create({answer: req.body.answer}, function(err, answer){
        Question.findOneAndUpdate({"_id": req.params.id}, {$inc:{quantAnswers: 1}}, {new: true}).then(async function(a){
            await a.whoAnswered.push(String(req.user._id));
            await a.save();
            return a;
        }).then(async function(a){
            answer.question.id = req.params.id;
            answer.whoAnswered.id = req.user._id;
            answer.whoAnswered.username = req.user.username;
            await answer.save();
            res.redirect('/home');
        })
    });
})

  
module.exports = router;