const express = require('express'),
      router = express.Router(),
      User = require('../.././models/user'),
      Answer = require('../../models/answer'),
      Question = require('../.././models/question'),
      middleware = require("../../middleware");
      var {isLoggedIn, globalenvironment} = middleware; // destructuring assignment

//configure flash
const flash = require('connect-flash')
router.use(flash());

/**Configure global variables */
router.use(globalenvironment);

/** Selection Box question create logic*/
router.post('/selectionBox', (req, res) => {
//lookup question using ID
    User.findById(req.user._id, function(err, user){
    if(err){
        console.log(err);
        res.redirect("/login");
    } else {
    Question.create({ expirationDate: req.body.expirationDate, description: req.body.description, title: req.body.title,  type: "selectionbox", creationDate: Date.now(), expirationDate: req.body.expirationDate }, function(err, question){
        if(!err){
        //add username and id to question
        question.author.id = user._id;
        question.author.username = user.username;
        //add options one by one
        req.body.options.forEach(option => {
            question.options.push(option);
        });
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

/** add option to Selection Box question*/
router.post("/addquestion/:id", function(req, res){
Question.findById({_id: req.params.id}, function(err, question){
    if(err) 
    {
    console.log(err);
    } 
    else 
    {
    question.options.push(req.body.option);
    question.save();
    res.json({ success: true });
    }
})
})

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

/** change title of question */
router.post("/updateQuestion/changeDescription/:id", function(req, res){
Question.findByIdAndUpdate({_id: req.params.id},{description: req.body.description}, function(err){
    if(err){
        console.log(err);
    } else {
        res.json({ success: true });
    }
    })
})

/** change title of question */
router.post("/updateQuestion/changeExpirationDate/:id", function(req, res){
    Question.findByIdAndUpdate({_id: req.params.id},{expirationDate: req.body.expirationDate}, function(err){
        if(err){
            console.log(err);
        } else {
            res.json({ success: true });
        }
        })
    })

/** create answer of multiple questions */
router.post("/selectionBoxAnswer/:id", function(req, res) {
    Answer.create({answer: req.body.answer}, function(err, answer){
        Question.findOneAndUpdate({"_id": req.params.id}, {$inc:{quantAnswers: 1}}, {new: true}).then(async function(a){
            await a.whoAnswered.push(String(req.user._id));
            await a.save();
            return a;
        }).then(async function(a){
            answer.question.id = req.params.id;
            answer.question.title = a.title;
            answer.question._id = a._id;
            answer.whoAnswered.id = req.user._id;
            answer.whoAnswered.username = req.user.username;
            answer.save();
            res.json({ success: true });

        })
        
    });
})


  
module.exports = router;