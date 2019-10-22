const express = require('express'),
      router = express.Router(),
      User = require('../.././models/user'),
      MultipleChoice = require('../.././models/multipleChoice'),
      MultipleChoiceAnswer = require('../.././models/multipleChoiceAnswer'),
      middleware = require("../../middleware");
      var {isLoggedIn, globalenvironment} = middleware; // destructuring assignment



//configure flash
const flash = require('connect-flash');
router.use(flash());

/**Configure global variables */
router.use(globalenvironment);

/** multiple Choice template route*/
router.get('/multipleChoice', (req, res) => {
    //
    res.render("multipleChoice");
  });

/** multiple Choice question create logic*/
router.post('/multipleChoice', (req, res) => {
//lookup multipleChoice using ID
    User.findById(req.user._id, function(err, user){
    if(err){
        console.log(err);
        res.redirect("/login");
    } else {
    MultipleChoice.create({ expirationDate: req.body.expirationDate, description: req.body.description, title: req.body.title }, function(err, multipleChoice){
        if(!err){
        //add username and id to multipleChoice
        multipleChoice.author.id = user._id;
        multipleChoice.author.username = user.username;
        //add options one by one
        req.body.options.forEach(option => {
            multipleChoice.options.push(option);
        });
        multipleChoice.save();
        res.redirect('/home');
        } else {
        console.log(err);
        res.send(err);
        }
    });
    }
}); 
});

/** add option to multiple Choice question*/
router.post("/addmultipleChoice/:id", function(req, res){
MultipleChoice.findById({_id: req.params.id}, function(err, multipleChoice){
    if(err) 
    {
    console.log(err);
    } 
    else 
    {
    multipleChoice.options.push(req.body.option);
    multipleChoice.save();
    res.json({ success: true });
    }
})
})

/** change title of question */
router.post("/addMultipleChoice/:id", function(req, res){
MultipleChoice.findByIdAndUpdate({_id: req.params.id},{title: req.body.title}, function(err){
    if(err){
        console.log(err);
    } else {
        res.json({ success: true });
    }
    })
})

/** change title of question */
router.post("/addMultipleChoice/:id", function(req, res){
MultipleChoice.findByIdAndUpdate({_id: req.params.id},{description: req.body.description}, function(err){
    if(err){
        console.log(err);
    } else {
        res.json({ success: true });
    }
    })
})

/** create answer of multiple questions */
router.post("/multipleChoiceAnswer/:id", function(req, res) {
MultipleChoiceAnswer.create({answer: req.body.answer}, function(err, multipleChoiceAnswer){
    if(!err){
    multipleChoiceAnswer.question.id = req.params.id;
    multipleChoiceAnswer.whoAnswered.id = req.user._id;
    multipleChoiceAnswer.whoAnswered.username = req.user.username;
    multipleChoiceAnswer.save();
    res.redirect('/home');
    } else {
    console.log(err);
    }
});
})


/** Answers routes */

router.get("/multipleChoiceAnswer", function(req, res){
MultipleChoice.find({}).populate("_question").populate("_whoAnswered").exec( function(err, answers){
    if(!err) {
    console.log(answers)
    } else { 
    console.log(err)
    }
});
});

//** REPORTS ANSWER */
  
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
      return next;
    }
    req.flash("success", "Para acessar essa página, por favor, faça login")
    res.redirect("/");
  }
  
  
module.exports = router;