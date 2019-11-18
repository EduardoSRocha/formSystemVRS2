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
router.post('/numeric', (req, res) => {
//lookup question using ID
    User.findById(req.user._id, function(err, user){
    if(err){
        console.log(err);
        res.redirect("/login");
    } else {
        
    Question.create({ expirationDate: req.body.expirationDate, description: req.body.description, title: req.body.title,  type: "numeric", creationDate: Date.now(), expirationDate: req.body.expirationDate}, function(err, question){
        if(!err){
        //add username and id to question
        question.author.id = user._id;
        question.author.username = user.username;
        res.redirect('/home');
        } else {
        console.log(err);
        res.send(err);
        }
    });
    }
}); 
});

/** add option to Question question*/
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
router.post("/updateQuestion/changeDescription:id", function(req, res){
Question.findByIdAndUpdate({_id: req.params.id},{description: req.body.description}, function(err){
    if(err){
        console.log(err);
    } else {
        res.json({ success: true });
    }
    })
})


/** change title of question */
router.post("/updateQuestion/changeExpirationDate:id", function(req, res){
    Question.findByIdAndUpdate({_id: req.params.id},{expirationDate: req.body.expirationDate}, function(err){
        if(err){
            console.log(err);
        } else {
            res.json({ success: true });
        }
        })
    })
    
/** create answer of numeric */
router.post("/answer/:id", function(req, res) {
Answer.create({answer: req.body.answer}, function(err, answer){
    Question.find({"_id": req.param.id}, function(err, question){
        question.whoAnswered.push(String(req.user._id));
        if(!err){
            answer.question.id = req.params.id;
            answer.whoAnswered.id = req.user._id;
            answer.whoAnswered.username = req.user.username;
            answer.save();
            res.json({ success: true });
            } else {
            console.log(err);
            }
    })
   
});
})


/** Answers routes */

router.get("/answer", function(req, res){
Question.find({}).populate("_question").populate("_whoAnswered").exec( function(err, answers){
    if(!err) {
    console.log(answers)
    } else { 
    console.log(err)
    }
});
});
  
module.exports = router;