const express = require('express'),
      router = express.Router(),
      User = require('../.././models/user'),
      ShortText = require('../.././models/shortText'),
      ShortTextAnswer = require('../.././models/shortTextAnswer'),
      middleware = require("../../middleware");
      var {isLoggedIn, globalenvironment} = middleware; // destructuring assignment

//configure flash
const flash = require('connect-flash');
router.use(flash());

/**Configure global variables */
router.use(globalenvironment);

/** Short Text template route*/
router.get('/shortText', (req, res) => {
    //
    res.render("shortText");
  });

/** Short Text question create logic*/
router.post('/shortText', (req, res) => {
//lookup shortText using ID
    User.findById(req.user._id, function(err, user){
    if(err){
        console.log(err);
        res.redirect("/login");
    } else {
    ShortText.create({ expirationDate: req.body.expirationDate, description: req.body.description, title: req.body.title }, function(err, shortText){
        if(!err){
            //add username and id to shortText
            shortText.author.id = user._id;
            shortText.author.username = user.username;
            shortText.save();
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
router.post("/addShortText/:id", function(req, res){
ShortText.findByIdAndUpdate({_id: req.params.id},{title: req.body.title}, function(err){
    if(err){
        console.log(err);
    } else {
        res.json({ success: true });
    }
    })
})

/** change title of question */
router.post("/addShortText/:id", function(req, res){
ShortText.findByIdAndUpdate({_id: req.params.id},{description: req.body.description}, function(err){
    if(err){
        console.log(err);
    } else {
        res.json({ success: true });
    }
    })
})

/** create answer of multiple questions */
router.post("/shortTextAnswer/:id", function(req, res) {
ShortTextAnswer.create({answer: req.body.answer}, function(err, shortTextAnswer){
    if(!err){
    shortTextAnswer.question.id = req.params.id;
    shortTextAnswer.whoAnswered.id = req.user._id;
    shortTextAnswer.whoAnswered.username = req.user.username;
    shortTextAnswer.save();
    res.json({ success: true });
    } else {
    console.log(err);
    }
});
})


/** Answers routes */

router.get("/shortTextAnswer", function(req, res){
ShortText.find({}).populate("_question").populate("_whoAnswered").exec( function(err, answers){
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